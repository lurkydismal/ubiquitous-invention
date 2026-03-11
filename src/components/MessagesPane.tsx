import { Box, Sheet, Stack } from "@mui/joy";
import AvatarWithStatus from "./AvatarWithStatus";
import ChatBubble from "./ChatBubble";
import MessagesPaneHeader from "./MessagesPaneHeader";
import { ChatProps, MessageProps } from "./MyMessages/types";
import { useEffect, useState } from "react";

type MessagesPaneProps = {
    chat: ChatProps;
};

export default function MessagesPane(props: MessagesPaneProps) {
    const { chat } = props;
    const [chatMessages, setChatMessages] = useState(chat.messages);

    useEffect(() => {
        setChatMessages(chat.messages);
    }, [chat.messages]);

    return (
        <Sheet
            sx={{
                height: {
                    xs: "calc(100dvh - var(--Header-height))",
                    md: "100dvh",
                },
                display: "flex",
                flexDirection: "column",
                backgroundColor: "background.level1",
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
                    overflowY: "scroll",
                    flexDirection: "column-reverse",
                }}
            >
                <Stack spacing={2} sx={{ justifyContent: "flex-end" }}>
                    {chatMessages.map(
                        (message: MessageProps, index: number) => {
                            const isYou = message.sender === "You";

                            return (
                                <Stack
                                    key={index}
                                    direction="row"
                                    spacing={2}
                                    sx={{
                                        flexDirection: isYou
                                            ? "row-reverse"
                                            : "row",
                                    }}
                                >
                                    {message.sender !== "You" && (
                                        <AvatarWithStatus
                                            online={message.sender.online}
                                            username={message.sender.name}
                                        />
                                    )}

                                    <ChatBubble
                                        variant={isYou ? "sent" : "received"}
                                        {...message}
                                    />
                                </Stack>
                            );
                        },
                    )}
                </Stack>
            </Box>
        </Sheet>
    );
}
