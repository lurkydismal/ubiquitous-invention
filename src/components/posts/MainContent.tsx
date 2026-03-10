import { Posts } from "@/components/Posts";
import { PostsRowFull } from "@/db/types";
import { paginate } from "@/utils/stdfunc";
import { Box, Typography } from "@mui/material";

export default function MainContent({ posts }: { posts: PostsRowFull[] }) {
    const perPage = 6;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div>
                <Typography variant="h2" gutterBottom>
                    Featured
                </Typography>
            </div>

            <Posts posts={paginate(posts, 1, perPage)} />
        </Box>
    );
}
