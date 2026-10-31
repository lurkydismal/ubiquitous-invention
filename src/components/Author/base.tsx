import { Avatar, AvatarGroup, Box, Typography, TypographyVariant } from "@mui/material";

import { linkSx } from "@/data/styles";
import { UserRowPublic } from "@/db/types";
import log from "@/utils/stdlog";

/**
 * Styles used for author name links.
 */
export const nameSx = {
    ...linkSx,

    px: 1,
    py: 0.75,

    "&::after": {
        transformOrigin: "left",
        bottom: 2,
    },

    "&:hover": {
        backgroundColor: "action.hover",
        transform: "translateY(-2px)",
    },

    "&:active": {
        transform: "translateY(0px)",
    },
};

export function profileHref(author: UserRowPublic) {
    return `/profile/${encodeURIComponent(author.name)}`;
}

/**
 * Small wrapper used for rows with left and optional right content.
 *
 * @param left - left-side node (required)
 * @param right - right-side node (optional)
 */
export function AuthorRow({ left, right }: { left: React.ReactNode; right?: React.ReactNode }) {
    log.trace("AuthorRow render");

    return (
        <Box
            sx={{
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
                gap: 2,
                justifyContent: "space-between",
                padding: "16px",
            }}
        >
            {left}
            {right ?? null}
        </Box>
    );
}

/**
 * Render single avatar + name.
 *
 * @param author - public user record
 * @param variant - MUI Typography variant
 * @param avatarWidth - avatar width in px
 * @param avatarHeight - avatar height in px
 */
export function AuthorInfo({
    author,
    variant = "caption",
    avatarWidth = 24,
    avatarHeight = 24,
}: {
    author: UserRowPublic;
    variant?: TypographyVariant;
    avatarWidth?: number;
    avatarHeight?: number;
}) {
    log.trace("AuthorInfo render", { name: author?.name });

    const initial = author?.name && author.name[0] ? author.name[0].toUpperCase() : "?";

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
                alignItems: "center",
            }}
        >
            <Avatar
                alt={author.name ?? "author"}
                src={author.image ?? undefined}
                sx={{ width: avatarWidth, height: avatarHeight }}
            >
                {initial}
            </Avatar>

            <Typography variant={variant}>{author.name}</Typography>
        </Box>
    );
}

/**
 * Render multiple avatars (AvatarGroup) and a comma-separated names list.
 *
 * @param authors - array of public user records
 * @param variant - typography variant
 * @param avatarWidth - avatar width in px
 * @param avatarHeight - avatar height in px
 */
export function AuthorsInfo({
    authors,
    variant = "caption",
    avatarWidth = 24,
    avatarHeight = 24,
}: {
    authors: UserRowPublic[];
    variant?: TypographyVariant;
    avatarWidth?: number;
    avatarHeight?: number;
}) {
    log.trace("AuthorsInfo render", { count: authors?.length ?? 0 });

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
                alignItems: "center",
            }}
        >
            <AvatarGroup max={3}>
                {authors.map((a) => (
                    <Avatar
                        key={a.name}
                        alt={a.name}
                        src={a.image ?? undefined}
                        sx={{ width: avatarWidth, height: avatarHeight }}
                    >
                        {a.name && a.name[0] ? a.name[0].toUpperCase() : "?"}
                    </Avatar>
                ))}
            </AvatarGroup>

            <Typography variant={variant}>{authors.map((a) => a.name).join(", ")}</Typography>
        </Box>
    );
}
