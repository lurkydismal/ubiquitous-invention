import { Link } from "@/components/Link";
import { UsersRowPublic } from "@/db/types";
import log from "@/utils/stdlog";
import { TypographyVariant } from "@mui/material";
import { AuthorInfo, AuthorRow, nameSx, profileHref } from "./base";
import FollowButton from "@/components/FollowButton";

/**
 * Author row with a Follow button on the right.
 * `uid` passed to FollowButton is the raw username (not URL-encoded).
 */
export function AuthorWithFollow({
    author,
    variant,
    avatarWidth,
    avatarHeight,
    doesFollow,
    needText,
    followCallback,
    unfollowCallback,
}: {
    author: UsersRowPublic;
    variant?: TypographyVariant;
    avatarWidth?: number;
    avatarHeight?: number;
    doesFollow: boolean;
    needText?: boolean;
    followCallback?: (usernameNormalized: string) => void;
    unfollowCallback?: (usernameNormalized: string) => void;
}) {
    log.trace("AuthorWithFollow render", {
        username: author?.username,
        doesFollow,
    });

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
                <FollowButton
                    uid={author.username_normalized}
                    doesFollow={doesFollow}
                    size="large"
                    needText={needText}
                    followCallback={followCallback}
                    unfollowCallback={unfollowCallback}
                />
            }
        />
    );
}

/**
 * Author row with link to profile and a Follow button.
 * Link targets use encoded username; FollowButton receives the raw username.
 */
export function AuthorWithFollowAndLink({
    author,
    variant,
    avatarWidth,
    avatarHeight,
    doesFollow,
    needText,
    followCallback,
    unfollowCallback,
}: {
    author: UsersRowPublic;
    variant?: TypographyVariant;
    avatarWidth?: number;
    avatarHeight?: number;
    doesFollow: boolean;
    needText?: boolean;
    followCallback?: (usernameNormalized: string) => void;
    unfollowCallback?: (usernameNormalized: string) => void;
}) {
    log.trace("AuthorWithFollowAndLink render", {
        username: author?.username,
        doesFollow,
    });

    return (
        <AuthorRow
            left={
                <Link underline="none" href={profileHref(author)} sx={nameSx}>
                    <AuthorInfo
                        author={author}
                        variant={variant}
                        avatarWidth={avatarWidth}
                        avatarHeight={avatarHeight}
                    />
                </Link>
            }
            right={
                <FollowButton
                    uid={author.username_normalized}
                    doesFollow={doesFollow}
                    size="large"
                    needText={needText}
                    followCallback={followCallback}
                    unfollowCallback={unfollowCallback}
                />
            }
        />
    );
}
