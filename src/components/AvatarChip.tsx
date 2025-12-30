import { Chip, Avatar, Stack } from "@mui/material";

export default function AvatarChips({ username }: { username: string }) {
    return (
        <Chip
            variant="filled"
            size="medium"
            avatar={<Avatar alt={username} src={username} />}
            label={username}
        />
    );
}
