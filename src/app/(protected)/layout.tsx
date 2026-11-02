import { Box, Container } from "@mui/material";
import { redirect } from "next/navigation";

import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { getSession } from "@/lib/dal/auth";

/** Renders the authenticated application shell. */
export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Route groups do not enforce authorization by themselves. Keep the
    // authoritative session check in this server layout as well as the proxy.
    const session = await getSession();

    if (!session) {
        redirect("/auth/login");
    }

    const username = session.user.name?.trim() || session.user.email || "User";

    return (
        <Box
            sx={{
                minHeight: "100dvh",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
            }}
        >
            <Sidebar username={username} />

            <Box
                component="main"
                sx={{
                    minWidth: 0,
                    minHeight: { md: "100dvh" },
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Container
                    maxWidth={false}
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        mt: { xs: 3, md: 4 },
                        mb: 4,
                        gap: 4,
                    }}
                >
                    {children}
                </Container>

                <Footer />
            </Box>
        </Box>
    );
}
