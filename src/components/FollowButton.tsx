"use client";

import { followAction, unfollowAction } from "@/lib/follow";
import {
    PersonRemove as UnfollowIcon,
    PersonAdd as FollowIcon,
} from "@mui/icons-material";
import {
    Box,
    ButtonProps,
    IconButton,
    SxProps,
    Theme,
    Tooltip,
} from "@mui/material";

import { Button } from "@mui/material";
import { useState, useTransition } from "react";

type Props = ButtonProps & {
    uid: string;
    doesFollow: boolean;
    size?: "small" | "medium" | "large";
    needText?: boolean;
    sx?: SxProps<Theme>;
    followCallback?: (usernameNormalized: string) => void;
    unfollowCallback?: (usernameNormalized: string) => void;
};

function FollowBase({
    uid,
    doesFollow,
    size,
    needText = false,
    sx,
    followCallback,
    unfollowCallback,
}: Props) {
    const [_doesFollow, setDoesFollow] = useState(doesFollow);

    const text = _doesFollow ? "Unfollow" : "Follow";
    const color = _doesFollow ? "error" : "success";
    const icon = _doesFollow ? <UnfollowIcon /> : <FollowIcon />;
    const [pending, startTransition] = useTransition();

    const handleClick = () => {
        startTransition(async () => {
            if (_doesFollow) {
                unfollowCallback?.(uid);

                await unfollowAction(uid);
            } else {
                followCallback?.(uid);

                await followAction(uid);
            }

            setDoesFollow(!_doesFollow);
        });
    };

    return needText ? (
        <Button
            size={size ?? "small"}
            onClick={handleClick}
            color={color}
            variant="contained"
            startIcon={icon}
            loading={pending}
            sx={sx}
        >
            {text}
        </Button>
    ) : (
        <Tooltip title={text} placement="top" arrow>
            <Box>
                <IconButton
                    size={size ?? "medium"}
                    onClick={handleClick}
                    color={color}
                    loading={pending}
                    sx={sx}
                >
                    {icon}
                </IconButton>
            </Box>
        </Tooltip>
    );
}

export function FollowButtonWithText(props: Omit<Props, "needText">) {
    return <FollowBase {...props} needText />;
}

export function FollowButton(props: Props) {
    return <FollowBase {...props} />;
}

export default FollowButton;
