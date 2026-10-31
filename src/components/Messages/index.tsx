"use client";

import { Box } from "@mui/material";
import { useState } from "react";

import { chats } from "@/data/MyMessages";

import ChatsPane from "../Messages/ChatsPane";
import MessagesPane from "../Messages/MessagesPane";
import { ChatProps } from "./types";

export default function MyProfile() {
    const [selectedChat, setSelectedChat] = useState<ChatProps>(chats[0]);

    return (
        <Box
            sx={{
                flex: 1,
                width: "100%",
                mx: "auto",
                pt: { xs: "var(--Header-height)", md: 0 },
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "minmax(min-content, min(30%, 400px)) 1fr",
                },
            }}
        >
            <Box
                sx={{
                    position: { xs: "fixed", sm: "sticky" },
                    transform: {
                        xs: "translateX(calc(100% * (var(--MessagesPane-slideIn, 0) - 1)))",
                        sm: "none",
                    },
                    transition: "transform 0.4s, width 0.4s",
                    zIndex: 100,
                    width: "100%",
                    top: 52,
                }}
            >
                <ChatsPane
                    chats={chats}
                    selectedChatId={selectedChat.id}
                    setSelectedChat={setSelectedChat}
                />
            </Box>

            <MessagesPane key={selectedChat.id} chat={selectedChat} />
        </Box>
    );
}
