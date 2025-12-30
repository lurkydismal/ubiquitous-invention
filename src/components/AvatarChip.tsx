import { Chip, Avatar, Stack } from "@mui/material";

export default function AvatarChips() {
    return (
        <Stack direction="row" spacing={1}>
            <Chip avatar={<Avatar>M</Avatar>} label="Avatar" />
            <Chip
                avatar={<Avatar alt="Natacha" src="/static/images/avatar/1.jpg" />}
                label="Avatar"
                variant="outlined"
            />
        </Stack>
    );
}
