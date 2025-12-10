'use client';
import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';
import { Inter } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
})

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

export default createTheme({
    colorSchemes: { light: true, dark: true },
    cssVariables: {
        colorSchemeSelector: 'class',
    },
    typography: {
        fontFamily: inter.style.fontFamily,
    },
    components: {
        MuiAlert: {
            styleOverrides: {
                root: {
                    variants: [
                        {
                            props: { severity: 'info' },
                            style: {
                                backgroundColor: '#60a5fa',
                            },
                        },
                    ],
                },
            },
        },
    },
});
