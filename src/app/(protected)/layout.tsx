import { Box } from "@mui/material";

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

            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    m: 0,
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
