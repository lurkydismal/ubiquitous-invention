"use client";

import { ReactNode, useMemo } from "react";
import {
    PendingOutlined as InProgressIcon,
    CheckCircleOutline as FinishedIcon,
    CancelOutlined as CancelledIcon,
    ScheduleOutlined as OutdatedIcon,
} from "@mui/icons-material";
import {
    Box,
    Card,
    CardContent,
    LinearProgress,
    linearProgressClasses,
    Stack,
    styled,
    Typography,
    useTheme,
} from "@mui/material";
import { PieChart, useDrawingArea } from "@mui/x-charts";
import log from "@/utils/stdlog";

type StatItem = {
    label: string;
    value: number; // percent 0..100
    icon?: ReactNode;
    color?: string;
};

interface MyPieChartProps {
    /**
     * Stats array. Will be normalized to 4 items (slice or pad with defaults).
     * Each item should contain `name` and `value` (0..100). `icon` and `color` are optional.
     */
    stats: StatItem[];
}

const DEFAULT_COLORS = [
    "hsl(220, 25%, 65%)",
    "hsl(220, 25%, 45%)",
    "hsl(220, 25%, 30%)",
    "hsl(220, 25%, 20%)",
];

const DEFAULT_ICONS: ReactNode[] = [
    <InProgressIcon key="inprogress" />,
    <FinishedIcon key="finished" />,
    <CancelledIcon key="cancelled" />,
    <OutdatedIcon key="outdated" />,
];

const StyledText = styled("text", {
    shouldForwardProp: (prop) => prop !== "variant",
})<{ variant?: "primary" | "secondary" }>(({ theme, variant }) => ({
    textAnchor: "middle",
    dominantBaseline: "central",
    fill: (theme.vars || theme).palette.text.secondary,
    fontSize:
        variant === "primary"
            ? (theme.typography.h5.fontSize as string)
            : (theme.typography.body2.fontSize as string),
    fontWeight:
        variant === "primary"
            ? (theme.typography.h5.fontWeight as number | string)
            : (theme.typography.body2.fontWeight as number | string),
}));

function formatShort(n: number) {
    if (!isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs >= 1_000_000_000)
        return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
    if (abs >= 1_000_000)
        return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
    if (abs >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
    return String(n);
}

function PieCenterLabel({
    primaryText,
    secondaryText,
}: {
    primaryText: string;
    secondaryText: string;
}) {
    const { width, height, left, top } = useDrawingArea();
    const primaryY = top + height / 2 - 8;
    const secondaryY = primaryY + 22;

    return (
        <>
            <StyledText variant="primary" x={left + width / 2} y={primaryY}>
                {primaryText}
            </StyledText>

            <StyledText variant="secondary" x={left + width / 2} y={secondaryY}>
                {secondaryText}
            </StyledText>
        </>
    );
}

export default function MyPieChart({ stats }: MyPieChartProps) {
    const theme = useTheme();

    // normalize stats to exactly 4 items:
    // - if incoming array is longer: slice to 4
    // - if shorter: pad with defaults (value 0)
    const normalizedStats = useMemo(() => {
        const provided = Array.isArray(stats) ? stats.slice(0, 4) : [];
        const result: StatItem[] = [];

        for (let i = 0; i < 4; i++) {
            const s = provided[i];
            if (s) {
                log.debug(1);
                result.push({
                    label: s.label ?? `Item ${i + 1}`,
                    value: Number.isFinite(s.value)
                        ? Math.max(0, Math.min(100, s.value))
                        : 0,
                    icon: s.icon ?? DEFAULT_ICONS[i],
                    color: s.color ?? DEFAULT_COLORS[i],
                });
            } else {
                log.debug(2);
                result.push({
                    label: ["In Progress", "Finished", "Cancelled", "Outdated"][
                        i
                    ],
                    value: 0,
                    icon: DEFAULT_ICONS[i],
                    color: DEFAULT_COLORS[i],
                });
            }
        }

        return result;
    }, [stats]);

    const total = useMemo(() => {
        // compute total from pie data (assumes pie is number[]), fall back to sum of stats values
        const pieSum =
            Array.isArray(stats) && stats.length > 0
                ? stats.reduce((a, b) => a + (b.value ?? 0), 0)
                : 0;
        if (pieSum > 0) return pieSum;

        // if pie is not usable, compute total from normalized stats (map percents -> sum of percents)
        const statsSum = normalizedStats.reduce(
            (a, b) => a + (b.value ?? 0),
            0,
        );
        return statsSum;
    }, [normalizedStats]);

    const totalText = formatShort(total);

    // computed center secondary label
    const secondaryLabel = "Total";

    // colors for PieChart mapped from normalizedStats (use fallback theme palette if needed)
    const chartColors = normalizedStats.map(
        (s) => s.color ?? (theme.vars || theme).palette.primary.dark,
    );

    return (
        <Card
            variant="outlined"
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                flexGrow: 1,
            }}
        >
            <CardContent>
                <Typography component="h2" variant="subtitle2" gutterBottom>
                    Tasks total
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 1,
                    }}
                >
                    <PieChart
                        colors={chartColors}
                        margin={{
                            left: 48,
                            right: 48,
                            top: 48,
                            bottom: 48,
                        }}
                        series={[
                            {
                                data: stats,
                                innerRadius: 64,
                                outerRadius: 96,
                                paddingAngle: 0,
                                highlightScope: {
                                    fade: "global",
                                    highlight: "item",
                                },
                            },
                        ]}
                        height={260}
                        width={260}
                        hideLegend
                    >
                        <PieCenterLabel
                            primaryText={totalText}
                            secondaryText={secondaryLabel}
                        />
                    </PieChart>
                </Box>

                {normalizedStats.map((stat, index) => (
                    <Stack
                        key={index}
                        direction="row"
                        sx={{ alignItems: "center", gap: 2, pb: 1.5 }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                minWidth: 28,
                            }}
                        >
                            {stat.icon}
                        </Box>

                        <Stack sx={{ gap: 0.5, flexGrow: 1 }}>
                            <Stack
                                direction="row"
                                sx={{
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 500 }}
                                >
                                    {stat.label}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{ color: "text.secondary" }}
                                >
                                    {stat.value}%
                                </Typography>
                            </Stack>

                            <LinearProgress
                                variant="determinate"
                                value={stat.value}
                                sx={{
                                    height: 8,
                                    borderRadius: 1,
                                    [`& .${linearProgressClasses.bar}`]: {
                                        backgroundColor: stat.color,
                                    },
                                    backgroundColor: (theme.vars || theme)
                                        .palette.action.hover,
                                }}
                                aria-label={`${stat.label} progress`}
                            />
                        </Stack>
                    </Stack>
                ))}
            </CardContent>
        </Card>
    );
}
