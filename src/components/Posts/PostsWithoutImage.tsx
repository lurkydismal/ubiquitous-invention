"use client";

import { NavigateNextRounded } from "@mui/icons-material";
import { AuthorsWithDate } from "@/components/Author";
import MainFallback from "@/components/MainFallback";
import { useRouter } from "next/navigation";
import { Truncated } from "./styled";
import { styled, Typography, Grid, Box } from "@mui/material";
import { PostsRowFull } from "@/db/types";
import { concatenateAuthors } from "@/utils/stdfunc";

const TitleTypography = styled(Typography)(({ theme }) => ({
    "&:hover": { cursor: "pointer" },
    position: "relative",
    textDecoration: "none",
    "& .arrow": {
        position: "absolute",
        right: 0,
        top: "50%",
        transform: "translateY(-50%)",
        visibility: "hidden",
    },
    "&:hover .arrow": {
        opacity: 0.7,
        visibility: "visible",
    },
    "&:focus-visible": {
        borderRadius: "8px",
        outline: "3px solid",
        outlineColor: "hsla(210, 98%, 48%, 0.5)",
        outlineOffset: "3px",
    },
    "&::before": {
        backgroundColor: (theme.vars || theme).palette.text.primary,
        bottom: 0,
        content: '""',
        height: "1px",
        left: 0,
        opacity: 0.3,
        position: "absolute",
        transition: "width 0.3s ease, opacity 0.3s ease",
        width: 0,
    },
    "&:hover::before": {
        width: "100%",
    },
}));

export default function PostsWithoutImage({
    posts,
}: {
    posts: PostsRowFull[];
}) {
    const router = useRouter();

    const handleNavigate = (id: number) => {
        router.push(`/post/${id}`);
    };

    // keyboard accessible navigation
    const handleKey = (e: React.KeyboardEvent, id: number) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleNavigate(id);
        }
    };

    return (
        <MainFallback itemsLength={posts.length}>
            <Grid container spacing={8} columns={12} sx={{ my: 4 }}>
                {posts.map((post, index) => (
                    <Grid key={index} size={{ xs: 12, sm: 6 }}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                height: "100%",
                                justifyContent: "space-between",
                            }}
                        >
                            <Typography
                                gutterBottom
                                variant="caption"
                                component="div"
                            >
                                {post.category?.name ?? "Unknown"}
                            </Typography>

                            <TitleTypography
                                onClick={() => handleNavigate(post.id)}
                                onKeyDown={(e) => handleKey(e, post.id)}
                                gutterBottom
                                tabIndex={0}
                                variant="h6"
                            >
                                {post.title}

                                <NavigateNextRounded
                                    className="arrow"
                                    sx={{ fontSize: "1rem" }}
                                />
                            </TitleTypography>

                            <Truncated
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                            >
                                {post.description}
                            </Truncated>

                            <AuthorsWithDate
                                authors={concatenateAuthors(post)}
                                date={post.created_at}
                            />
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </MainFallback>
    );
}
