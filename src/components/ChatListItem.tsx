import { Circle as CircleIcon } from "@mui/icons-material";
import AvatarWithStatus from "./AvatarWithStatus";
import { ChatProps, MessageProps, UserProps } from "./MyMessages/types";
import { Box, ListDivider, ListItem, ListItemButton, ListItemButtonProps, Stack, Typography } from "@mui/joy";
// import { toggleMessagesPane } from "@/stdfunc";

type ChatListItemProps = ListItemButtonProps & {
    id: string;
    unread?: boolean;
    sender: UserProps;
    messages: MessageProps[];
    selectedChatId?: string;
    setSelectedChat: (chat: ChatProps) => void;
};

export default function ChatListItem(props: ChatListItemProps) {
    const { id, sender, messages, selectedChatId, setSelectedChat } = props;
    const selected = selectedChatId === id;

    return (
        <>
            <ListItem>
                <ListItemButton
                    onClick={() => {
                        // toggleMessagesPane();
                        setSelectedChat({ id, sender, messages });
                    }}
                    selected={selected}
                    color="neutral"
                    sx={{
                        flexDirection: "column",
                        alignItems: "initial",
                        gap: 1,
                    }}
                >
                    <Stack direction="row" spacing={1.5}>
                        <AvatarWithStatus
                            online={sender.online}
                            username={sender.name}
                        />

                        <Box sx={{ flex: 1 }}>
                            <Typography level="title-sm">
                                {sender.name}
                            </Typography>

                            <Typography level="body-sm">
                                {sender.name}
                            </Typography>
                        </Box>

                        <Box sx={{ lineHeight: 1.5, textAlign: "right" }}>
                            {messages[0].unread && (
                                <CircleIcon
                                    sx={{ fontSize: 12 }}
                                    color="primary"
                                />
                            )}

                            <Typography
                                level="body-xs"
                                noWrap
                                sx={{ display: { xs: "none", md: "block" } }}
                            >
                                5 mins ago
                            </Typography>
                        </Box>
                    </Stack>

                    <Typography
                        level="body-sm"
                        sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: "2",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {messages[0].content}
                    </Typography>
                </ListItemButton>
            </ListItem>

            <ListDivider sx={{ margin: 0 }} />
        </>
    );
}
