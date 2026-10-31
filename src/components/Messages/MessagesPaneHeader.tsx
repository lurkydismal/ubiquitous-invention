import {
    Circle as CircleIcon,
    ArrowBackIosNewRounded as ArrowBackIosNewRoundedIcon,
} from "@mui/icons-material";
import { Avatar, Chip, IconButton, Stack, Typography } from "@mui/material";

import { UserProps } from "./types";

type MessagesPaneHeaderProps = {
    sender: UserProps;
};

export default function MessagesPaneHeader(props: MessagesPaneHeaderProps) {
    const { sender } = props;
    const isOnline = sender.online;

    return (
        <Stack
            direction="row"
            sx={{
                justifyContent: "space-between",
                alignItems: "center",
                py: 2,
                px: { xs: 1, md: 2 },
                borderBottom: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
            }}
        >
            <Stack
                direction="row"
                spacing={{ xs: 1, md: 2 }}
                sx={{ alignItems: "center", minWidth: 0 }}
            >
                <IconButton
                    aria-label="Back to conversations"
                    color="inherit"
                    size="small"
                    sx={{ display: { xs: "inline-flex", sm: "none" } }}
                >
                    <ArrowBackIosNewRoundedIcon />
                </IconButton>

                <Avatar sx={{ width: 40, height: 40 }} alt={sender.name}>
                    {sender.name.slice(0, 1).toUpperCase()}
                </Avatar>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                    <Typography component="h2" variant="h6" noWrap>
                        {sender.name}
                    </Typography>

                    <Chip
                        icon={
                            <CircleIcon
                                sx={{
                                    fontSize: 8,
                                    color: isOnline ? "success.main" : "text.disabled",
                                }}
                            />
                        }
                        label={isOnline ? "Online" : "Offline"}
                        variant="outlined"
                        size="small"
                        sx={{ borderRadius: 1, "& .MuiChip-icon": { ml: 0.75 } }}
                    />
                </Stack>
            </Stack>
        </Stack>
    );
}
