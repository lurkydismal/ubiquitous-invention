import { Box, Container } from "@mui/material";
import Sidebar from "@/components/Sidebar";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
            }}
        >
            <Sidebar />

            <Container
                maxWidth="xl"
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {children}
            </Container>
        </Box>
    );
}
