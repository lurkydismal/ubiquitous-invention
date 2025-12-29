import "./globals.css";
import * as React from "react";
import Box from "@mui/joy/Box";
import { Inter } from "next/font/google";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { SidebarWrapper } from "@/components/Sidebar";
import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";

export const metadata: Metadata = {
    title: "Tasker",
};

const font = Inter({
    weight: ["300", "400", "500", "700"],
    variable: "--font-main",
    subsets: ["latin"],
    display: "swap",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={font.variable} suppressHydrationWarning>
            <body>
                <InitColorSchemeScript attribute="class" defaultMode="dark" />

                <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                    <Box sx={{ display: "flex", minHeight: "100dvh" }}>
                        <SidebarWrapper />

                        {children}
                    </Box>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
