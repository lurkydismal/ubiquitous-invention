import { Circle as CircleIcon } from "@mui/icons-material";
import {
    Box,
    Divider,
    ListItem,
    ListItemButton,
    ListItemButtonProps,
    Stack,
    Typography,
} from "@mui/material";

import AvatarWithStatus from "@/components/Avatar/WithStatus";
import { ChatProps, MessageProps, UserProps } from "@/components/Messages/types";

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
    const latestMessage = messages[0];
    const selected = selectedChatId === id;

    return (
        <>
            <ListItem disablePadding>
                <ListItemButton
                    onClick={() => setSelectedChat({ id, sender, messages })}
                    selected={selected}
                    sx={{
                        flexDirection: "column",
                        alignItems: "initial",
                        gap: 1,
                        px: 2,
                        py: 1.5,
                    }}
                >
                    <Stack direction="row" spacing={1.5} sx={{ width: "100%", minWidth: 0 }}>
                        <AvatarWithStatus online={sender.online} username={sender.name} />

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="subtitle2" noWrap>
                                {sender.name}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" noWrap>
                                {sender.name}
                            </Typography>
                        </Box>

                        <Box sx={{ lineHeight: 1.5, textAlign: "right", flexShrink: 0 }}>
                            {latestMessage?.unread && (
                                <CircleIcon sx={{ fontSize: 12 }} color="primary" />
                            )}

                            <Typography
                                variant="caption"
                                color="text.secondary"
                                noWrap
                                sx={{ display: { xs: "none", md: "block" } }}
                            >
                                5 mins ago
                            </Typography>
                        </Box>
                    </Stack>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            width: "100%",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {latestMessage?.content ?? ""}
                    </Typography>
                </ListItemButton>
            </ListItem>

            <Divider component="li" sx={{ my: 0 }} />
        </>
    );
}
