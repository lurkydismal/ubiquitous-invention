import { Avatar } from "@mui/material";

export default function AvatarWrapper({
    username,
    ...props
}: {
    username: string;
}) {
    return (
        <Avatar {...props} alt={username}>
            {username[0].toUpperCase()}
        </Avatar>
    );
}
