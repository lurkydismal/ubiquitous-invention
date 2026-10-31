import { Box, TypographyVariant, Avatar, Typography, AvatarGroup } from "@mui/material";
import { Fragment } from "react";

import { Link } from "@/components/Link";
import { linkSx } from "@/data/styles";
import { UserRowPublic } from "@/db/types";
import log from "@/utils/stdlog";

import { AuthorInfo, AuthorRow, AuthorsInfo, nameSx, profileHref } from "./base";

export { AuthorWithFollow, AuthorWithFollowAndLink } from "./WithFollow";

/**
 * Styles used for author date links.
 */
const dateSx = {
    ...linkSx,

    px: 2.5,

    "&::after": {
        ...linkSx["&::after"],

        left: 16,
        right: 16,
        bottom: 2,
    },
};

/**
 * Single author row (avatar + name).
 */
export function Author({
    author,
    variant,
    avatarWidth,
    avatarHeight,
}: {
    author: UserRowPublic;
    variant?: TypographyVariant;
    avatarWidth?: number;
    avatarHeight?: number;
}) {
    log.trace("Author render", { name: author?.name });

    return (
        <AuthorRow
            left={
                <AuthorInfo
                    author={author}
                    variant={variant}
                    avatarWidth={avatarWidth}
                    avatarHeight={avatarHeight}
                />
            }
        />
    );
}

/**
 * Multiple authors row (avatars + names).
 */
export function Authors({
    authors,
    variant,
    avatarWidth,
    avatarHeight,
}: {
    authors: UserRowPublic[];
    variant?: TypographyVariant;
    avatarWidth?: number;
    avatarHeight?: number;
}) {
    log.trace("Authors render", { count: authors?.length ?? 0 });

    return (
        <AuthorRow
            left={
                <AuthorsInfo
                    authors={authors}
                    variant={variant}
                    avatarWidth={avatarWidth}
                    avatarHeight={avatarHeight}
                />
            }
        />
    );
}

/**
 * Single author with date on the right.
 * Accepts `date` as Date | string; strings are converted with `new Date(...)`.
 */
export function AuthorWithDate({
    author,
    date,
    variant,
    avatarWidth,
    avatarHeight,
}: {
    author: UserRowPublic;
    date: Date | string;
    variant?: TypographyVariant;
    avatarWidth?: number;
    avatarHeight?: number;
}) {
    log.trace("AuthorWithDate render", { name: author?.name });
    const d = new Date(date);

    return (
        <AuthorRow
            left={
                <AuthorInfo
                    author={author}
                    variant={variant}
                    avatarWidth={avatarWidth}
                    avatarHeight={avatarHeight}
                />
            }
            right={
                <Typography variant={variant ?? "caption"}>
                    {d.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                </Typography>
            }
        />
    );
}

/**
 * Single author whose name/avatar link to the author's profile.
 * Profile URL uses encoded name in the path; the profile page should decode the slug.
 */
export function AuthorWithDateAndLink({
    author,
    date,
    variant,
    avatarWidth,
    avatarHeight,
}: {
    author: UserRowPublic;
    date: Date | string;
    variant?: TypographyVariant;
    avatarWidth?: number;
    avatarHeight?: number;
}) {
    log.trace("AuthorWithDateAndLink render", { name: author?.name });

    const d = new Date(date);

    return (
        <AuthorRow
            left={
                <Link
                    underline="none"
                    href={profileHref(author)}
                    sx={{ display: "inline-flex", alignItems: "center" }}
                >
                    <AuthorInfo
                        author={author}
                        variant={variant}
                        avatarWidth={avatarWidth}
                        avatarHeight={avatarHeight}
                    />
                </Link>
            }
            right={
                <Typography variant={variant ?? "caption"}>
                    {d.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                </Typography>
            }
        />
    );
}

/**
 * Multiple authors with links for each name (and avatars shown in an AvatarGroup).
 * Each author's name links to `/profile/<encoded-name>`.
 */
export function AuthorsWithDateAndLink({
    authors,
    date,
    variant,
    avatarWidth,
    avatarHeight,
}: {
    authors: UserRowPublic[];
    date: Date | string;
    variant?: TypographyVariant;
    avatarWidth?: number;
    avatarHeight?: number;
}) {
    log.trace("AuthorsWithDateAndLink render", { count: authors?.length ?? 0 });

    const d = new Date(date);

    return (
        <AuthorRow
            left={
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
                            <Link
                                key={a.name + "-avatar"}
                                href={profileHref(a)}
                                underline="none"
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                }}
                            >
                                <Avatar
                                    alt={a.name}
                                    src={a.image ?? undefined}
                                    sx={{
                                        width: avatarWidth,
                                        height: avatarHeight,
                                    }}
                                >
                                    {a.name && a.name[0] ? a.name[0].toUpperCase() : "?"}
                                </Avatar>
                            </Link>
                        ))}
                    </AvatarGroup>

                    <Typography variant={variant}>
                        {authors.map((a, i) => (
                            <Fragment key={a.name}>
                                <Link
                                    underline="none"
                                    variant="h4"
                                    href={profileHref(a)}
                                    sx={nameSx}
                                >
                                    {a.name}
                                </Link>
                                {i < authors.length - 1 && ", "}
                            </Fragment>
                        ))}
                    </Typography>
                </Box>
            }
            right={
                <Typography variant={variant ?? "caption"} sx={dateSx}>
                    {d.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                </Typography>
            }
        />
    );
}

/**
 * Multiple authors + date (no links).
 */
export function AuthorsWithDate({
    authors,
    date,
    variant,
    avatarWidth,
    avatarHeight,
}: {
    authors: UserRowPublic[];
    date: Date | string;
    variant?: TypographyVariant;
    avatarWidth?: number;
    avatarHeight?: number;
}) {
    log.trace("AuthorsWithDate render", { count: authors?.length ?? 0 });

    const d = new Date(date);

    return (
        <AuthorRow
            left={
                <AuthorsInfo
                    authors={authors}
                    variant={variant}
                    avatarWidth={avatarWidth}
                    avatarHeight={avatarHeight}
                />
            }
            right={
                <Typography variant={variant ?? "caption"}>
                    {d.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                </Typography>
            }
        />
    );
}
