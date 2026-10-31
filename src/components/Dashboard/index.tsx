import { Box, Grid, Typography } from "@mui/material";
import { GridRowsProp } from "@mui/x-data-grid";

import pie from "@/data/dashboard/pie";
import stats from "@/data/dashboard/stats";

import PageViewsBarChart from "./BarChart";
import SessionsChart from "./LineChart";
import ChartUserByCountry from "./PieChart";
import StatCard from "./StatCard";
import TasksGrid from "./TasksGrid";

export default function MainGrid({ rows }: { rows: GridRowsProp }) {
    return (
        <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
            <Typography component="h2" variant="h6" sx={{ mt: 2, mb: 2 }}>
                Tasks overview
            </Typography>

            <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
                {stats.map((card, index) => (
                    <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
                        <StatCard {...card} />
                    </Grid>
                ))}

                <Grid size={{ xs: 12, md: 6 }}>
                    <SessionsChart />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <PageViewsBarChart />
                </Grid>
            </Grid>

            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                Details
            </Typography>

            <Grid container spacing={2} columns={12}>
                <Grid size={{ xs: 12, lg: 9 }}>
                    <TasksGrid rows={rows} />
                </Grid>

                <Grid size={{ xs: 12, lg: 3 }}>
                    <ChartUserByCountry stats={pie} />
                </Grid>
            </Grid>
        </Box>
    );
}
