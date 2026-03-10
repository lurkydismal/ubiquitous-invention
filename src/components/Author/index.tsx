import { Link } from "@/components/Link";
import log from "@/utils/stdlog";
import { Fragment } from "react";
import {
    Box,
    TypographyVariant,
    Avatar,
    Typography,
    AvatarGroup,
} from "@mui/material";
import { linkSx } from "@/data/styles";
import { UsersRowPublic } from "@/db/types";
import {
    AuthorInfo,
    AuthorRow,
    AuthorsInfo,
    nameSx,
    profileHref,
} from "./base";

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
    author: UsersRowPublic;
    variant?: TypographyVariant;
    avatarWidth?: number;
    avatarHeight?: number;
}) {
    log.trace("Author render", { username: author?.username });

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
    authors: UsersRowPublic[];
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
    author: UsersRowPublic;
    date: Date | string;
    variant?: TypographyVariant;
    avatarWidth?: number;
    avatarHeight?: number;
}) {
    log.trace("AuthorWithDate render", { username: author?.username });
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
 * Profile URL uses encoded username in the path; the profile page should decode the slug.
 */
export function AuthorWithDateAndLink({
    author,
    date,
    variant,
    avatarWidth,
    avatarHeight,
}: {
    author: UsersRowPublic;
    date: Date | string;
    variant?: TypographyVariant;
    avatarWidth?: number;
    avatarHeight?: number;
}) {
    log.trace("AuthorWithDateAndLink render", { username: author?.username });

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
 * Each author's name links to `/profile/<encoded-username>`.
 */
export function AuthorsWithDateAndLink({
    authors,
    date,
    variant,
    avatarWidth,
    avatarHeight,
}: {
    authors: UsersRowPublic[];
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
                                key={a.username + "-avatar"}
                                href={profileHref(a)}
                                underline="none"
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                }}
                            >
                                <Avatar
                                    alt={a.username}
                                    src={a.avatar_url ?? undefined}
                                    sx={{
                                        width: avatarWidth,
                                        height: avatarHeight,
                                    }}
                                >
                                    {a.username && a.username[0]
                                        ? a.username[0].toUpperCase()
                                        : "?"}
                                </Avatar>
                            </Link>
                        ))}
                    </AvatarGroup>

                    <Typography variant={variant}>
                        {authors.map((a, i) => (
                            <Fragment key={a.username}>
                                <Link
                                    underline="none"
                                    variant="h4"
                                    href={profileHref(a)}
                                    sx={nameSx}
                                >
                                    {a.username}
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
    authors: UsersRowPublic[];
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
