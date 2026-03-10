"use client";

import PostsPagination from "@/components/Pagination";
import { SearchButton } from "@/components/SearchButton";
import { TagsAndSearchMobile } from "@/components/Tags";
import { paginate } from "@/utils/stdfunc";
import { Follow, Follows } from "./Follows";
import { useState, ChangeEvent } from "react";
import { Box, Container, Typography } from "@mui/material";
import { CategoriesRowPublic } from "@/db/types";

export default function MainContent({
    follows,
    tags,
}: {
    follows: Follow[];
    tags: CategoriesRowPublic[];
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 12;

    const onChange = (_: ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    return (
        <Box
            sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                gap: 1,
            }}
        >
            <Typography variant="h2" gutterBottom>
                Follows
            </Typography>

            <SearchButton />

            <TagsAndSearchMobile tags={tags} />

            <Container
                sx={{
                    flexGrow: 1,
                }}
            >
                <Follows follows={paginate(follows, currentPage, perPage)} />
            </Container>

            <PostsPagination
                total={follows.length}
                perPage={perPage}
                onChange={onChange}
            />
        </Box>
    );
}
