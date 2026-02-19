import Sidebar from "@/components/Sidebar";
import { Box } from "@mui/material";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Box sx={{ display: "flex", minHeight: "100dvh" }}>
            <Sidebar />

            {children}
        </Box>
    );
}
