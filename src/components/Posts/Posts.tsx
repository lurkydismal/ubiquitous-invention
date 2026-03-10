"use client";

import { NavigateNextRounded } from "@mui/icons-material";
import { AuthorsWithDate } from "@/components/Author";
import { useRouter } from "next/navigation";
import { Truncated } from "./styled";
import {
    styled,
    Card,
    Box,
    CardContent,
    Grid,
    CardMedia,
    Typography,
} from "@mui/material";
import { PostsRowFull } from "@/db/types";
import { concatenateAuthors } from "@/utils/stdfunc";

/* Card wrapper — lift + subtle shadow on hover/focus */
const StyledCard = styled(Card)(({ theme }) => ({
    backgroundColor: (theme.vars || theme).palette.background.paper,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: 0,
    transition: "transform 240ms ease, box-shadow 240ms ease",
    borderRadius: theme.shape.borderRadius,
    cursor: "pointer",
    outline: "none",

    // Normal state has subtle outline for contrast on light bg
    "&:hover, &:focus-visible": {
        transform: "translateY(-6px)",
        boxShadow: theme.shadows[6],
    },

    // visible focus ring (keyboard)
    "&:focus-visible": {
        boxShadow: `0 0 0 4px ${theme.palette.action.focus}`,
    },
}));

/* Media wrapper for image scale + overlay */
const MediaWrapper = styled("div")(({ theme }) => ({
    position: "relative",
    overflow: "hidden",
    borderBottom: `1px solid ${theme.palette.divider}`,
    img: {
        display: "block",
        width: "100%",
        height: "auto",
        transition: "transform 400ms ease, filter 300ms ease",
        willChange: "transform",
    },
}));

/* Overlay with arrow that appears on hover */
const MediaOverlay = styled(Box)(({ theme }) => ({
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: theme.spacing(2),
    pointerEvents: "none",
    background: "linear-gradient(90deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.28))",
    color: theme.palette.primary.contrastText,
    opacity: 0,
    transform: "translateY(4px)",
    transition: "opacity 220ms ease, transform 220ms ease",

    // small box behind icon for clearer touch target on mobile
    "& .arrowBox": {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        borderRadius: 20,
        background: "rgba(0,0,0,0.28)",
    },

    // when parent is hovered, show overlay — parent hook below sets hover
}));

/* Content area */
const StyledCardContent = styled(CardContent)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    gap: theme.spacing(1.5),
    padding: theme.spacing(2),
    "&:last-child": {
        paddingBottom: theme.spacing(2),
    },
}));

export default function Posts({ posts }: { posts: PostsRowFull[] }) {
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
        <Grid container spacing={2} columns={12}>
            {posts.map((post, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={post.id ?? index}>
                    <StyledCard
                        onClick={() => handleNavigate(post.id)}
                        onKeyDown={(e) => handleKey(e, post.id)}
                        tabIndex={0}
                        role="link"
                        aria-label={`${post.title} — ${post.id}`}
                        variant="outlined"
                        sx={{
                            // sync overlay + image transform via sx for hover state
                            "&:hover .post-image": {
                                transform: "scale(1.06)",
                            },
                            "&:hover .post-overlay": {
                                opacity: 1,
                                transform: "translateY(0)",
                            },
                        }}
                    >
                        <MediaWrapper>
                            <CardMedia
                                className="post-image"
                                component="img"
                                alt={post.title}
                                image={
                                    post.preview_url ??
                                    `https://picsum.photos/800/450?random=${post.id ?? index}`
                                }
                                sx={{
                                    aspectRatio: "16/9",
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                                loading="lazy"
                            />

                            <MediaOverlay className="post-overlay">
                                <Box className="arrowBox" aria-hidden>
                                    <NavigateNextRounded />
                                </Box>
                            </MediaOverlay>
                        </MediaWrapper>

                        <StyledCardContent>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {post.category?.name ?? "Unknown"}
                            </Typography>

                            <Typography variant="h6">{post.title}</Typography>

                            <Truncated variant="body2" color="text.secondary">
                                {post.description}
                            </Truncated>
                        </StyledCardContent>

                        <AuthorsWithDate
                            authors={concatenateAuthors(post)}
                            date={post.created_at}
                        />
                    </StyledCard>
                </Grid>
            ))}
        </Grid>
    );
}
