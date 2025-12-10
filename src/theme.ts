"use client";

import { extendTheme } from "@mui/joy/styles";
import { Geist } from "next/font/google";

const font = Geist({
    weight: ["300", "400", "500", "700"],
    variable: "--font-geist",
    subsets: ["latin"],
    display: "swap",
});

export default extendTheme({
    colorSchemes: {
        light: {},
        dark: {},
    },
    fontFamily: {
        body: font.style.fontFamily,
        display: font.style.fontFamily,
        code: font.style.fontFamily,
    },
});

// export default createTheme({
//     colorSchemes: { light: true, dark: true },
//     cssVariables: {
//         colorSchemeSelector: "class",
//     },
//     typography: {
//         fontFamily: font.style.fontFamily,
//     },
//     components: {
//         MuiAlert: {
//             styleOverrides: {
//                 root: {
//                     variants: [
//                         {
//                             props: { severity: "info" },
//                             style: {
//                                 backgroundColor: "#60a5fa",
//                             },
//                         },
//                     ],
//                 },
//             },
//         },
//     },
// });
