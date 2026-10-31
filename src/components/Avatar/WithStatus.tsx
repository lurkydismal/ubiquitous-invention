import { Avatar, AvatarProps, Badge } from "@mui/material";

type AvatarWithStatusProps = AvatarProps & {
    online?: boolean;
    username?: string;
};

export default function AvatarWithStatus(props: AvatarWithStatusProps) {
    const { online = false, username = "", size = "small", ...other } = props;

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
            <Avatar size={size} alt={username} {...other}>
                {username.slice(0, 1).toUpperCase()}
            </Avatar>
        </Badge>
    );
}
