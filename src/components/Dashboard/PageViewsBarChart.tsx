"use client";

import { BarChart } from "@mui/x-charts/BarChart";
import views from "@/data/dashboard/views";
import { Card, CardContent, Chip, Stack, Typography, useTheme } from "@mui/material";

export default function PageViewsBarChart() {
    const theme = useTheme();
    const colorPalette = [
        (theme.vars || theme).palette.primary.dark,
        (theme.vars || theme).palette.secondary.dark,
        (theme.vars || theme).palette.success.dark,
    ];

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
                            1.3M
                        </Typography>

                        <Chip
                            size="small"
                            color="error"
                            label="-8%"
                            className="text-black"
                        />
                    </Stack>

                    <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                    >
                        Tasks changed and users activity for the last 6 months
                    </Typography>
                </Stack>

                <BarChart
                    borderRadius={8}
                    colors={colorPalette}
                    xAxis={[
                        {
                            scaleType: "band",
                            categoryGapRatio: 0.5,
                            data: [
                                "Jan",
                                "Feb",
                                "Mar",
                                "Apr",
                                "May",
                                "Jun",
                                "Jul",
                            ],
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
