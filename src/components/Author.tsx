import * as React from "react";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import NextLink from "@/components/Link";
import Typography from "@mui/material/Typography";
import { TypographyVariant } from "@mui/material/styles";
import log from "@/utils/stdlog";

export interface Author {
    id: number;
    name: string;
    avatar?: string;
}

// Helper: base container for an author row.
function AuthorRow({
    left,
    right,
}: {
    left: React.ReactNode;
    right?: React.ReactNode;
}) {
    log.trace(`Rendering AuthorRow: ${{ left, right }}`);

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
            {right && right}
        </Box>
    );
}

// Helper: single author avatar + name.
function AuthorInfo({
    author,
    variant = "caption",
    avatarWidth = 24,
    avatarHeight = 24,
}: {
    author: Author;
    variant?: TypographyVariant;
    avatarWidth?: number;
    avatarHeight?: number;
}) {
    log.trace(
        `Rendering AuthorInfo: ${{ author, variant, avatarWidth, avatarHeight }}`,
    );

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
                alt={author.name}
                src={author.name}
                sx={{ width: avatarWidth, height: avatarHeight }}
            />
            <Typography variant={variant}>{author.name}</Typography>
        </Box>
    );
}

// Helper: multiple authors (AvatarGroup + names).
function AuthorsInfo({
    authors,
    variant = "caption",
    avatarWidth = 24,
    avatarHeight = 24,
}: {
    authors: Author[];
    variant?: TypographyVariant;
    avatarWidth?: number;
    avatarHeight?: number;
}) {
    log.trace(
        `Rendering AuthorsInfo: ${{ authors, variant, avatarWidth, avatarHeight }}`,
    );

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
                {authors.map((author) => (
                    <Avatar
                        key={author.id}
                        alt={author.name}
                        src={author.name}
                        sx={{ width: avatarWidth, height: avatarHeight }}
                    />
                ))}
            </AvatarGroup>
            <Typography variant={variant}>
                {authors.map((author) => author.name).join(", ")}
            </Typography>
        </Box>
    );
}

// Refactored components using the helpers:

export function Author({
    author,
    variant,
    avatarWidth,
    avatarHeight,
}: {
    author: Author;
    variant?: TypographyVariant;
    avatarWidth?: number;
    avatarHeight?: number;
}) {
    log.trace(`Rendering Author component: ${{ author }}`);

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

export function Authors({
    authors,
    variant,
    avatarWidth,
    avatarHeight,
}: {
    authors: Author[];
    variant?: TypographyVariant;
    avatarWidth?: number;
    avatarHeight?: number;
}) {
    log.trace(`Rendering Authors component: ${{ authors }}`);

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

export function AuthorWithDate({
    author,
    date = new Date(),
    variant,
    avatarWidth,
    avatarHeight,
}: {
    author: Author;
    date?: Date;
    variant?: TypographyVariant;
    avatarWidth?: number;
    avatarHeight?: number;
}) {
    log.trace(`Rendering AuthorWithDate: ${{ author, date }}`);

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
                    {date.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                </Typography>
            }
        />
    );
}

export function AuthorWithLink({
    author,
    variant,
    avatarWidth,
    avatarHeight,
}: {
    author: Author;
    variant?: TypographyVariant;
    avatarWidth?: number;
    avatarHeight?: number;
}) {
    log.trace(`Rendering AuthorWithDateAndLink: ${{ author }}`);

    return (
        <AuthorRow
            left={
                <Link
                    component={NextLink}
                    underline="none"
                    href={`/profile/${author.id}`}
                >
                    <AuthorInfo
                        author={author}
                        variant={variant}
                        avatarWidth={avatarWidth}
                        avatarHeight={avatarHeight}
                    />
                </Link>
            }
        />
    );
}

export function AuthorWithDateAndLink({
    author,
    date = new Date(),
    variant,
    avatarWidth,
    avatarHeight,
}: {
    author: Author;
    date?: Date;
    variant?: TypographyVariant;
    avatarWidth?: number;
    avatarHeight?: number;
}) {
    log.trace(`Rendering AuthorWithDateAndLink: ${{ author, date }}`);

    return (
        <AuthorRow
            left={
                <Link
                    component={NextLink}
                    underline="none"
                    href={`/profile/${author.id}`}
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
                    {date.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                </Typography>
            }
        />
    );
}

export function AuthorsWithDateAndLink({
    authors,
    date = new Date(),
    variant,
    avatarWidth,
    avatarHeight,
}: {
    authors: Author[];
    date?: Date;
    variant?: TypographyVariant;
    avatarWidth?: number;
    avatarHeight?: number;
}) {
    log.trace(`Rendering AuthorsWithDateAndLink: ${{ authors, date }}`);

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
                    {/* Stack avatars, each wrapped in a Link */}
                    <AvatarGroup max={3}>
                        {authors.map((author) => (
                            <Avatar
                                key={author.id}
                                alt={author.name}
                                src={author.name}
                                sx={{
                                    width: avatarWidth,
                                    height: avatarHeight,
                                }}
                            />
                        ))}
                    </AvatarGroup>
                    {/* List names separated by commas, each name wrapped in a Link */}
                    <Typography variant={variant}>
                        {authors.map((author, index) => (
                            <React.Fragment key={author.id}>
                                <Link
                                    component={NextLink}
                                    underline="none"
                                    href={`/profile/${author.id}`}
                                >
                                    {author.name}
                                </Link>
                                {index < authors.length - 1 && ", "}
                            </React.Fragment>
                        ))}
                    </Typography>
                </Box>
            }
            right={
                <Typography variant={variant ?? "caption"}>
                    {date.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                </Typography>
            }
        />
    );
}

export function AuthorsWithDate({
    authors,
    date = new Date(),
    variant,
    avatarWidth,
    avatarHeight,
}: {
    authors: Author[];
    date?: Date;
    variant?: TypographyVariant;
    avatarWidth?: number;
    avatarHeight?: number;
}) {
    log.trace(`Rendering AuthorsWithDate: ${{ authors, date }}`);

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
                    {date.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                </Typography>
            }
        />
    );
}
