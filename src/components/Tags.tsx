"use client";

import { Box, Chip } from "@mui/material";
import { SearchButtonMobile } from "@/components/SearchButton";
import { CategoriesRowPublic } from "@/db/types";
import log from "@/utils/stdlog";

const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // TODO: Implement
    log.info("You clicked the filter chip. ", event.currentTarget.textContent);
};

export function Tags({ tags }: { tags: CategoriesRowPublic[] }) {
    return (
        <Box
            sx={{
                display: "inline-flex",
                flexDirection: "row",
                gap: 3,
                overflow: "auto",
            }}
        >
            <Chip onClick={handleClick} size="medium" label="All categories" />

            {tags.map((tag, index) => (
                <Chip
                    label={tag.name}
                    key={index}
                    onClick={handleClick}
                    size="medium"
                    sx={{
                        backgroundColor: "transparent",
                        border: "none",
                    }}
                />
            ))}
        </Box>
    );
}

export function TagsAndSearchMobile({ tags }: { tags: CategoriesRowPublic[] }) {
    return (
        <Box
            sx={{
                alignItems: { xs: "start", md: "center" },
                display: "flex",
                flexDirection: { xs: "column-reverse", md: "row" },
                gap: 4,
                justifyContent: "space-between",
                overflow: "auto",
                width: "100%",
            }}
        >
            <Tags tags={tags} />

            <SearchButtonMobile />
        </Box>
    );
}
