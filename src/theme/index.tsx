"use client";

import {
    colorSchemes,
    shadows,
    shape,
    typography,
} from "@/theme/themePrimitives";
import * as DG from "@mui/x-data-grid/locales";
import * as MUI from "@mui/material/locale";
import {
    ThemeOptions,
    createTheme,
    ThemeProvider,
    useMediaQuery,
    THEME_ID as MATERIAL_THEME_ID,
    useColorScheme as useMaterialColorScheme
} from "@mui/material";
import { CssVarsProvider as JoyCssVarsProvider, useColorScheme as useJoyColorScheme } from "@mui/joy";
import { useEffect } from "react";

// Props for AppTheme wrapper
export interface AppThemeProps {
    children?: React.ReactNode;
    themeComponents?: ThemeOptions["components"]; // Optional overrides for MUI component styles
}

function ColorSchemeSync({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { mode, setMode: setMaterialMode } = useMaterialColorScheme();
    const { setMode: setJoyMode } = useJoyColorScheme();

    useEffect(() => {
        setMaterialMode(mode ?? "system");
        setJoyMode(mode ?? "system");
    }, [mode, setMaterialMode, setJoyMode]);

    return (children);
}

// Main AppTheme component providing theme and localization
export default function AppTheme(props: AppThemeProps) {
    const { children, themeComponents } = props;
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)", {
        noSsr: true,
    });

    // Get user's browser locale (e.g., "en-US") and extract language code ("en")
    const userLocale = navigator.language || "en-US";
    const lang = userLocale.split("-")[0];

    // Function to fetch localized messages for MUI components, DataGrid, and DatePicker
    // with a fallback to enUS
    const getLocales = (localeName: string) => ({
        mui: (MUI as Record<string, typeof MUI.enUS>)[localeName] || MUI.enUS,
        dg:
            (DG as unknown as Record<string, typeof DG.enUS>)[localeName] ||
            DG.enUS,
    });

    // Destructure the selected locales
    const { mui, dg } = getLocales(lang);

    // Create MUI theme with custom primitives, dark/light mode, and localization
    const theme = createTheme(
        {
            palette: {
                mode: prefersDarkMode ? "dark" : "light",
            },
            cssVariables: {
                colorSchemeSelector: "data",
            },
            typography,
            colorSchemes,
            shadows,
            shape,
            components: {
                ...themeComponents, // merge any user-provided component overrides
            },
        },
        mui, // apply MUI core locale
        dg, // apply DataGrid locale
    );

    // Render ThemeProvider and JoyCssVarsProvider wrapping the app's children
    return (
        <ThemeProvider
            theme={{ [MATERIAL_THEME_ID]: theme }}
            disableTransitionOnChange
        >
            <JoyCssVarsProvider disableTransitionOnChange>
                <ColorSchemeSync>
                    {children}
                </ColorSchemeSync>
            </JoyCssVarsProvider>
        </ThemeProvider>
    );
}
