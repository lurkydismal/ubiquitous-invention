import { Box, Paper, Stack } from "@mui/material";

import AvatarWithStatus from "@/components/Avatar/WithStatus";
import ChatBubble from "@/components/Messages/ChatBubble";
import MessagesPaneHeader from "@/components/Messages/MessagesPaneHeader";
import { ChatProps, MessageProps } from "@/components/Messages/types";

type MessagesPaneProps = {
    chat: ChatProps;
};

export default function MessagesPane(props: MessagesPaneProps) {
    const { chat } = props;

    return (
        <Paper
            square
            elevation={0}
            sx={{
                height: {
                    xs: "calc(100dvh - var(--Header-height))",
                    md: "100dvh",
                },
                display: "flex",
                flexDirection: "column",
                bgcolor: "background.default",
            }}
        >
            <MessagesPaneHeader sender={chat.sender} />

            <Box
                sx={{
                    display: "flex",
                    flex: 1,
                    minHeight: 0,
                    px: 2,
                    py: 3,
                    overflowY: "auto",
                    flexDirection: "column-reverse",
                }}
            >
                <Stack spacing={2} sx={{ justifyContent: "flex-end" }}>
                    {chat.messages.map((message: MessageProps, index: number) => {
                        const isYou = message.sender === "You";

                        return (
                            <Stack
                                key={message.id ?? index}
                                direction="row"
                                spacing={2}
                                sx={{
                                    flexDirection: isYou ? "row-reverse" : "row",
                                    alignItems: "flex-end",
                                }}
                            >
                                {message.sender !== "You" && (
                                    <AvatarWithStatus
                                        online={message.sender.online}
                                        username={message.sender.name}
                                    />
                                )}

                                <ChatBubble variant={isYou ? "sent" : "received"} {...message} />
                            </Stack>
                        );
                    })}
                </Stack>
            </Box>
        </Paper>
    );
}
