import { Box, Typography } from "@mui/material";

export default function Title() {
    return (
        <Box sx={{ width: { sm: "100%", md: "60%" } }}>
            <Typography
                component="h2"
                gutterBottom
                sx={{ color: "text.primary" }}
                variant="h4"
            >
                Features
            </Typography>

            <Typography
                sx={{ color: "text.secondary", mb: { xs: 2, sm: 4 } }}
                variant="body1"
            >
                Our platform offers a clean, developer-focused space for
                publishing and discovering technical articles.
            </Typography>
        </Box>
    );
}
