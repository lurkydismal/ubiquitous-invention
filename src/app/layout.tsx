import "./globals.css";
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
    variable: "--font-main",
    subsets: ["latin"],
    display: "swap",
});

/*
import {
  createTheme,
  ThemeProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/material/CssBaseline';

const materialTheme = createTheme();

export default function App() {
  return (
    <ThemeProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider>
        <CssBaseline enableColorScheme />
        ...Material UI and Joy UI components
      </JoyCssVarsProvider>
    </ThemeProvider>
  );
}
*/

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={font.variable} suppressHydrationWarning>
            <body>
                <InitColorSchemeScript attribute="data" />

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
