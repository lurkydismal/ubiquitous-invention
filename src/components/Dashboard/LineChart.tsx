"use client";

import { useId, useMemo } from "react";
import sessions from "@/data/dashboard/sessions";
import {
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
    useTheme,
    ChipOwnProps,
} from "@mui/material";
import { LineChart, LineSeries } from "@mui/x-charts";

export type StrictLineSeries = Omit<LineSeries, "data"> & {
    data: number[];
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
    if (first === 0) return last === 0 ? 0 : 100;
    return ((last - first) / Math.abs(first)) * 100;
}

function AreaGradient({ id, color }: { id: string; color: string }) {
    return (
        <defs>
            <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity={0.45} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
        </defs>
    );
}

export default function SessionsChart() {
    const theme = useTheme();
    const uid = useId();

    const { labels, series, totalText, percentText, chipColor, lastN } =
        useMemo(() => {
            if (!sessions || sessions.length === 0) {
                return {
                    labels: [] as string[],
                    series: [] as typeof sessions,
                    totalText: "—",
                    percentText: "0%",
                    chipColor: "default" as "default" | "success" | "error",
                    lastN: 0,
                };
            }

            // determine max length of series
            const len = Math.max(...sessions.map((s) => s.data?.length ?? 0));
            const lastN = len;

            // normalize/pad each series to same length (pad with 0)
            const padded = sessions.map((s) => ({
                ...s,
                data: Array.from({ length: len }, (_, i) => s.data?.[i] ?? 0),
            }));

            // aggregated per index (sum across series) for trend calculations
            const aggregated = Array.from({ length: len }, (_, i) =>
                padded.reduce((acc, s) => acc + (s.data[i] ?? 0), 0),
            );

            // total sum of all values across all series (as requested)
            const totalSum = padded.reduce(
                (acc, s) => acc + s.data.reduce((a, b) => a + b, 0),
                0,
            );
            const totalText = formatShort(totalSum);

            // trend: compare aggregated first index vs last index
            const first = aggregated[0] ?? 0;
            const last = aggregated[aggregated.length - 1] ?? 0;
            const percent = computeChangePercent(first, last);
            const rounded = Math.round(percent);
            const sign = rounded > 0 ? "+" : "";
            const percentText = `${sign}${rounded}%`;
            const chipColor =
                Math.abs(percent) <= 5
                    ? "default"
                    : percent > 0
                        ? "success"
                        : "error";

            // labels for xAxis: Day 1..N
            const labels = Array.from(
                { length: len },
                (_, i) => `Day ${i + 1}`,
            );

            return {
                labels,
                series: padded,
                totalText,
                percentText,
                chipColor,
                lastN,
            };
        }, []);

    const colorPalette = useMemo(
        () =>
            [
                (theme.vars || theme).palette.primary.dark,
                (theme.vars || theme).palette.success.dark,
                (theme.vars || theme).palette.secondary.dark,
                (theme.vars || theme).palette.error.dark,
            ].slice(0, Math.max(1, sessions.length)),
        [theme],
    );

    // build sx to point area fills to gradient ids that are unique
    const areaSx = useMemo(() => {
        const sx: Record<string, unknown> = {};
        for (const s of series) {
            // class pattern used by MUI X Charts for area elements
            sx[`& .MuiAreaElement-series-${s.id}`] = {
                fill: `url('#${uid}-${s.id}')`,
            };
        }
        return sx;
    }, [series, uid]);

    return (
        <Card variant="outlined" sx={{ width: "100%" }}>
            <CardContent>
                <Typography component="h2" variant="subtitle2" gutterBottom>
                    Tasks
                </Typography>

                <Stack sx={{ justifyContent: "space-between", mb: 2 }}>
                    <Stack
                        direction="row"
                        sx={{ alignItems: "center", gap: 1 }}
                    >
                        <Typography variant="h4" component="p">
                            {totalText}
                        </Typography>

                        <Chip
                            size="small"
                            color={chipColor as ChipOwnProps["color"]}
                            label={percentText}
                        />
                    </Stack>

                    <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                    >
                        Tasks information per day for the last {lastN} days
                    </Typography>
                </Stack>

                <LineChart
                    colors={colorPalette}
                    xAxis={[
                        {
                            scaleType: "point",
                            data: labels,
                            tickInterval: (_, i) => (i + 1) % 5 === 0,
                            height: 24,
                        },
                    ]}
                    yAxis={[{ width: 50 }]}
                    series={series}
                    height={300}
                    margin={{ left: 0, right: 20, top: 20, bottom: 0 }}
                    grid={{ horizontal: true }}
                    sx={areaSx}
                    hideLegend
                >
                    {/* Gradients for each series (unique ids) */}
                    {series.map((s) => (
                        <AreaGradient
                            key={s.id}
                            id={`${uid}-${s.id}`}
                            color={
                                // match colors to series index
                                colorPalette[
                                series.indexOf(s) % colorPalette.length
                                ] ?? (theme.vars || theme).palette.primary.dark
                            }
                        />
                    ))}
                </LineChart>
            </CardContent>
        </Card>
    );
}
