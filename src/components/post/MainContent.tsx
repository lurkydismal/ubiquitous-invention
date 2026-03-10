import { AuthorsWithDateAndLink } from "@/components/Author";
import Markdown from "@/components/Markdown";
import { Box, Typography, CardMedia } from "@mui/material";
import { ComponentProps } from "react";
import { linkSx } from "@/data/styles";
import { PostsRowFull } from "@/db/types";
import { concatenateAuthors } from "@/utils/stdfunc";

const tagSx = {
    ...linkSx,
    px: 2.5,

    "&::after": {
        content: '""',
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 6,
        height: 2,
        backgroundColor: "primary.main",
        transform: "scaleX(0)",
        transition: "transform 0.2s ease",
    },

    "&:hover": {
        backgroundColor: "action.hover",
        transform: "translateY(-2px)",
    },

    "&:hover::after": {
        transform: "scaleX(1)",
    },

    "&:focus-visible": {
        outline: "2px solid",
        outlineColor: "primary.main",
        outlineOffset: 2,
    },
};

export default function MainContent({ post }: { post: PostsRowFull }) {
    const properties = {
        authors: concatenateAuthors(post),
        date: post.created_at,
        variant: "h4",
        avatarWidth: 52,
        avatarHeight: 52,
    } satisfies ComponentProps<typeof AuthorsWithDateAndLink>;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <AuthorsWithDateAndLink {...properties} />

            <Typography
                variant="subtitle1"
                component="div"
                width="fit-content"
                sx={tagSx}
            >
                {post.category?.name ?? "Unknown"}
            </Typography>

            <Typography gutterBottom tabIndex={0} variant="h3">
                {post.title}
            </Typography>

            <CardMedia
                alt="green iguana"
                component="img"
                image={
                    post.preview_url ??
                    `https://picsum.photos/2400/1800?random=${post.id}`
                }
                sx={{
                    aspectRatio: "12 / 6",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            />

            <Markdown>{post.content}</Markdown>
        </Box>
    );
}
