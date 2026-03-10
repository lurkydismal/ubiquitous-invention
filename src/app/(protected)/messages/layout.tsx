import { CssBaseline } from "@mui/joy";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <CssBaseline />

            {children}
        </>
    );
}
