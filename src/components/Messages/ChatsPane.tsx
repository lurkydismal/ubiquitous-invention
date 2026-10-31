import {
    SearchRounded as SearchRoundedIcon,
    CloseRounded as CloseRoundedIcon,
} from "@mui/icons-material";
import {
    Box,
    Chip,
    IconButton,
    InputAdornment,
    List,
    OutlinedInput,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import ChatListItem from "@/components/Messages/ChatListItem";
import { ChatProps } from "@/components/Messages/types";

type ChatsPaneProps = {
    chats: ChatProps[];
    setSelectedChat: (chat: ChatProps) => void;
    selectedChatId: string;
};

export default function ChatsPane(props: ChatsPaneProps) {
    const { chats, setSelectedChat, selectedChatId } = props;

    return (
        <Paper
            square
            elevation={0}
            sx={{
                borderRight: "1px solid",
                borderColor: "divider",
                height: {
                    sm: "calc(100dvh - var(--Header-height))",
                    md: "100dvh",
                },
                overflowY: "auto",
                bgcolor: "background.paper",
            }}
        >
            <Stack
                direction="row"
                spacing={1}
                sx={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    pb: 1.5,
                }}
            >
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", mr: "auto" }}>
                    <Typography component="h1" variant="h6">
                        Messages
                    </Typography>
                    <Chip label="4" variant="filled" color="primary" size="small" />
                </Stack>

                <IconButton
                    aria-label="Close conversations"
                    color="inherit"
                    size="small"
                    onClick={() => {}}
                    sx={{ display: { sm: "none" } }}
                >
                    <CloseRoundedIcon />
                </IconButton>
            </Stack>

            <Box sx={{ px: 2, pb: 1.5 }}>
                <OutlinedInput
                    fullWidth
                    size="small"
                    startAdornment={
                        <InputAdornment position="start">
                            <SearchRoundedIcon fontSize="small" />
                        </InputAdornment>
                    }
                    placeholder="Search"
                    inputProps={{ "aria-label": "Search conversations" }}
                />
            </Box>

            <List disablePadding sx={{ py: 0 }}>
                {chats.map((chat) => (
                    <ChatListItem
                        key={chat.id}
                        {...chat}
                        setSelectedChat={setSelectedChat}
                        selectedChatId={selectedChatId}
                    />
                ))}
            </List>
        </Paper>
    );
}
