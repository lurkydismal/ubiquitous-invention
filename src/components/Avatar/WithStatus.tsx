import { Avatar, Badge } from "@mui/material";
import type { AvatarProps } from "@mui/material";

type AvatarWithStatusProps = AvatarProps & {
    online?: boolean;
    username?: string;
    size?: "small" | "medium" | "large";
};

const avatarDimensions = {
    small: 32,
    medium: 40,
    large: 48,
} as const;

export default function AvatarWithStatus(props: AvatarWithStatusProps) {
    const { online = false, username = "", size = "small", sx, ...other } = props;

    return (
        <Badge
            variant="dot"
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            sx={{
                "& .MuiBadge-badge": {
                    width: 9,
                    height: 9,
                    minWidth: 9,
                    borderRadius: "50%",
                    backgroundColor: online ? "success.main" : "text.disabled",
                    boxShadow: (theme) => `0 0 0 2px ${theme.palette.background.paper}`,
                },
            }}
        >
            <Avatar
                alt={username}
                {...other}
                sx={[
                    { width: avatarDimensions[size], height: avatarDimensions[size] },
                    ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
                ]}
            >
                {username.slice(0, 1).toUpperCase()}
            </Avatar>
        </Badge>
    );
}
