"use client";

import lightImg from "@/../public/static/screenshots/dashboard.png";
import darkImg from "@/../public/static/screenshots/dashboard-dark.png";
import NextLink, { Link } from "@/components/Link";
import Image from "next/image";
import {
    styled,
    Box,
    Container,
    Stack,
    Typography,
    Button,
} from "@mui/material";

const ImageWrapper = styled(Box)(({ theme }) => ({
    position: "relative",
    width: "100%",
    border: "1px solid",
    borderColor: (theme.vars || theme).palette.grey[200],
    borderRadius: (theme.vars || theme).shape.borderRadius,
    boxShadow: "0 0 12px 8px hsla(220, 25%, 80%, 0.12)",
    height: 400,
    marginTop: theme.spacing(8),
    outline: "3px solid transparent",
    outlineColor: "hsla(220, 25%, 80%, 0.12)",
    overflow: "hidden",
    [theme.breakpoints.up("sm")]: {
        height: 700,
        marginTop: theme.spacing(10),
    },
    ...theme.applyStyles("dark", {
        borderColor: (theme.vars || theme).palette.grey[700],
        boxShadow: "0 0 24px 12px hsla(210, 100%, 12%, 0.12)",
        outlineColor: "hsla(220, 20%, 42%, 0.06)",
    }),
}));

export default function Hero() {
    return (
        <Box
            component="section"
            sx={(theme) => ({
                backgroundImage:
                    "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)",
                backgroundRepeat: "no-repeat",
                width: "100%",
                ...theme.applyStyles("dark", {
                    backgroundImage:
                        "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)",
                }),
            })}
        >
            <Container
                sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                    pb: { xs: 8, sm: 12 },
                    pt: { xs: 4, sm: 10 },
                }}
            >
                <Stack
                    spacing={2}
                    sx={{
                        alignItems: "center",
                        width: { xs: "100%", sm: "70%" },
                        textAlign: "center",
                    }}
                    useFlexGap
                >
                    <Typography
                        component="h1"
                        variant="h1"
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: "center",
                            gap: 1,
                            fontSize: "clamp(3rem, 10vw, 3.5rem)",
                            lineHeight: 1.02,
                        }}
                    >
                        <Box component="span" sx={{ mr: { sm: 1 } }}>
                            vigilant
                        </Box>

                        <Box
                            component="span"
                            sx={(theme) => ({
                                color: "primary.main",
                                fontSize: "inherit",
                                ...theme.applyStyles("dark", {
                                    color: "primary.light",
                                }),
                            })}
                        >
                            funicular
                        </Box>
                    </Typography>

                    <Typography
                        sx={{
                            color: "text.secondary",
                            textAlign: "center",
                            width: { sm: "100%", md: "80%" },
                        }}
                    >
                        Explore our community of developers and creators sharing
                        in-depth articles, insights, and project stories. Dive
                        into topics that shape modern tech and innovation.
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <Button
                            color="primary"
                            size="medium"
                            variant="contained"
                            href="/auth/register"
                            component={NextLink}
                            aria-label="Sign up"
                        >
                            Sign up
                        </Button>

                        <Button
                            color="primary"
                            variant="outlined"
                            size="medium"
                            href="/auth/login"
                            component={NextLink}
                            aria-label="Sign in"
                        >
                            Sign in
                        </Button>
                    </Stack>

                    <Typography
                        color="text.secondary"
                        sx={{ textAlign: "center" }}
                        variant="caption"
                    >
                        By clicking &quot;Sign up&quot; you agree to our&nbsp;
                        <Link
                            color="primary"
                            href="/terms"
                            aria-label="Terms and Conditions"
                        >
                            Terms &amp; Conditions
                        </Link>
                        .
                    </Typography>
                </Stack>

                <ImageWrapper role="img" aria-hidden="true">
                    {/* Use <picture> so the browser only downloads the correct (light/dark) asset */}
                    <Box
                        component="picture"
                        sx={{ position: "absolute", inset: 0 }}
                    >
                        <Box
                            component="source"
                            srcSet={darkImg.src}
                            media="(prefers-color-scheme: dark)"
                        />
                        <Image
                            src={lightImg}
                            alt="App dashboard screenshot"
                            fill
                            sizes="(min-width:1024px) 700px, (min-width:600px) 420px, 100vw"
                            style={{
                                objectFit: "cover",
                                objectPosition: "center",
                            }}
                            priority // improves LCP for hero image
                        />
                    </Box>
                </ImageWrapper>
            </Container>
        </Box>
    );
}
