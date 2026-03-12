"use client";

import { useId, useMemo } from "react";
import {
    Box,
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";
import { SparkLineChart, areaElementClasses } from "@mui/x-charts";

export type StatCardProps = {
    title: string;
    data: number[]; // data points for the sparkline, assumed chronological (oldest -> newest)
};

function formatShort(n: number) {
    if (!isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs >= 1_000_000_000)
        return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
    if (abs >= 1_000_000)
        return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
    if (abs >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
    return String(n);
}

function computeChangePercent(first: number, last: number) {
    if (first === 0) {
        if (last === 0) return 0;
        return last > 0 ? 100 : -100;
    }
    return ((last - first) / Math.abs(first)) * 100;
}

export default function StatCard({ title, data }: StatCardProps) {
    const theme = useTheme();
    const id = useId();

    const derived = useMemo(() => {
        if (!data || data.length === 0) {
            return {
                intervalText: "No data",
                valueText: "—",
                percent: 0,
                percentText: "0%",
                trend: "neutral" as "up" | "down" | "neutral",
                labels: [] as string[],
            };
        }

        const len = data.length;
        const first = data[0];
        const last = data[data.length - 1];

        const percent = computeChangePercent(first, last);
        const isNeutral = Math.abs(percent) <= 5; // neutral threshold 5%
        const trend: "up" | "down" | "neutral" = isNeutral
            ? "neutral"
            : percent > 0
              ? "up"
              : "down";

        const roundedPercent = Math.round(percent);
        const sign = roundedPercent > 0 ? "+" : "";
        const percentText = `${sign}${roundedPercent}%`;

        // interval as "Last N days"
        const intervalText = len === 1 ? "Last day" : `Last ${len} days`;

        // value text: show last value formatted
        const sum = data.reduce((acc, v) => acc + v, 0);
        const valueText = formatShort(sum);

        // labels for sparkline: "Day 1" .. "Day N"
        const labels = Array.from({ length: len }, (_, i) => `Day ${i + 1}`);

        return { intervalText, valueText, percent, percentText, trend, labels };
    }, [data]);

    const trendColors = {
        up:
            theme.palette.mode === "light"
                ? theme.palette.success.main
                : theme.palette.success.dark,
        down:
            theme.palette.mode === "light"
                ? theme.palette.error.main
                : theme.palette.error.dark,
        neutral:
            theme.palette.mode === "light"
                ? theme.palette.grey[400]
                : theme.palette.grey[700],
    };

    const chipColor =
        derived.trend === "up"
            ? "success"
            : derived.trend === "down"
              ? "error"
              : "default";

    const chartColor = trendColors[derived.trend];

    return (
        <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
            <CardContent>
                <Typography component="h2" variant="subtitle2" gutterBottom>
                    {title}
                </Typography>

                <Stack
                    direction="column"
                    sx={{
                        justifyContent: "space-between",
                        flexGrow: 1,
                        gap: 1,
                    }}
                >
                    <Stack>
                        <Stack
                            direction="row"
                            sx={{
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="h4" component="p">
                                {derived.valueText}
                            </Typography>

                            <Chip
                                size="small"
                                color={chipColor}
                                label={derived.percentText}
                            />
                        </Stack>

                        <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                        >
                            {derived.intervalText}
                        </Typography>
                    </Stack>

                    <Box sx={{ width: "100%", height: 50 }}>
                        {data && data.length > 0 ? (
                            <SparkLineChart
                                color={chartColor}
                                data={data}
                                area
                                showHighlight
                                showTooltip
                                xAxis={{
                                    scaleType: "band",
                                    data: derived.labels,
                                }}
                                sx={{
                                    [`& .${areaElementClasses.root}`]: {
                                        fill: `url(#area-gradient-${id})`,
                                    },
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id={`area-gradient-${id}`}
                                        x1="50%"
                                        y1="0%"
                                        x2="50%"
                                        y2="100%"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor={chartColor}
                                            stopOpacity={0.3}
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor={chartColor}
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                            </SparkLineChart>
                        ) : (
                            <Box
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "text.disabled",
                                }}
                            >
                                <Typography variant="caption">
                                    No chart data
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}
