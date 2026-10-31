"use client";

import { Card, CardContent, Chip, ChipOwnProps, Stack, Typography, useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { useMemo } from "react";

import views from "@/data/dashboard/views";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatShort(n: number) {
    if (!isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
    if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
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

export default function MyBarChart() {
    const theme = useTheme();

    // color palette for bars (keeps the original intent)
    const colorPalette = [
        (theme.vars || theme).palette.primary.dark,
        (theme.vars || theme).palette.secondary.dark,
        (theme.vars || theme).palette.success.dark,
    ];

    // derive categories and aggregated metrics from `views`
    const derived = useMemo(() => {
        if (!views || views.length === 0) {
            return {
                categories: [] as string[],
                totalSumText: "—",
                percentText: "0%",
                chipColor: "default" as "default" | "success" | "error",
                intervalText: "No data",
            };
        }

        // determine length (take longest series length conservatively)
        const len = Math.max(...views.map((s) => s.data?.length ?? 0));
        // fallback categories if caller doesn't provide them in the chart xAxis
        const categories = MONTHS.slice(0, len);

        // aggregate values per category index across all series
        const aggregated: number[] = Array.from({ length: len }, (_, idx) =>
            views.reduce((acc, series) => acc + (series.data?.[idx] ?? 0), 0),
        );

        const totalSum = aggregated.reduce((a, b) => a + b, 0);
        const totalSumText = formatShort(totalSum);

        const first = aggregated[0] ?? 0;
        const last = aggregated[aggregated.length - 1] ?? 0;
        const percent = computeChangePercent(first, last);
        const rounded = Math.round(percent);
        const sign = rounded > 0 ? "+" : "";
        const percentText = `${sign}${rounded}%`;

        const chipColor = Math.abs(percent) <= 5 ? "default" : percent > 0 ? "success" : "error";
        const intervalText = len === 1 ? "Last month" : `Last ${len} months`;

        return {
            categories,
            totalSumText,
            percentText,
            chipColor,
            intervalText,
        };
    }, []);

    return (
        <Card variant="outlined" sx={{ width: "100%" }}>
            <CardContent>
                <Typography component="h2" variant="subtitle2" gutterBottom>
                    Tasks changed and users activity
                </Typography>

                <Stack sx={{ justifyContent: "space-between" }}>
                    <Stack
                        direction="row"
                        sx={{
                            alignContent: { xs: "center", sm: "flex-start" },
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <Typography variant="h4" component="p">
                            {derived.totalSumText}
                        </Typography>

                        <Chip
                            size="small"
                            color={derived.chipColor as ChipOwnProps["color"]}
                            label={derived.percentText}
                        />
                    </Stack>

                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Tasks changed and users activity for the {derived.intervalText}
                    </Typography>
                </Stack>

                <BarChart
                    borderRadius={8}
                    colors={colorPalette}
                    xAxis={[
                        {
                            scaleType: "band",
                            categoryGapRatio: 0.5,
                            data: derived.categories,
                            height: 24,
                        },
                    ]}
                    yAxis={[{ width: 50 }]}
                    series={views}
                    height={250}
                    margin={{ left: 0, right: 0, top: 20, bottom: 0 }}
                    grid={{ horizontal: true }}
                    hideLegend
                />
            </CardContent>
        </Card>
    );
}
