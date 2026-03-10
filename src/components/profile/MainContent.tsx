"use client";

import MainFallback from "@/components/MainFallback";
import { Author, AuthorWithFollow } from "@/components/Author";
import PostsPagination from "@/components/Pagination";
import { Posts } from "@/components/Posts";
import { SearchButton } from "@/components/SearchButton";
import { TagsAndSearchMobile } from "@/components/Tags";
import { CategoriesRowPublic, PostsRowFull, UsersRowPublic } from "@/db/types";
import { paginate } from "@/utils/stdfunc";
import { Box } from "@mui/material";
import { useState, ChangeEvent, ComponentProps } from "react";

export default function MainContent({
    user,
    posts,
    tags,
    doesFollow = false,
    isMe = false,
}: {
    user: UsersRowPublic;
    posts: PostsRowFull[];
    tags: CategoriesRowPublic[];
    doesFollow?: boolean;
    isMe?: boolean;
}) {
    doesFollow = isMe ? false : doesFollow;

    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 6;

    const onChange = (_: ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const properties = {
        author: user,
        variant: "h2",
        avatarWidth: 76,
        avatarHeight: 76,
    } satisfies ComponentProps<typeof Author>;

    return (
        <Box
            sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
        >
            {isMe ? (
                <Author {...properties} />
            ) : (
                <AuthorWithFollow
                    {...properties}
                    doesFollow={doesFollow}
                    needText
                />
            )}

            <MainFallback itemsLength={posts.length}>
                <SearchButton />

                <TagsAndSearchMobile tags={tags} />

                <Posts posts={paginate(posts, currentPage, perPage)} />

                <PostsPagination
                    total={posts.length}
                    perPage={perPage}
                    onChange={onChange}
                />
            </MainFallback>
        </Box>
    );
}
