import { Box, Paper, Stack, Typography } from "@mui/material";

import { MessageProps } from "@/components/Messages/types";

type ChatBubbleProps = MessageProps & {
    variant: "sent" | "received";
};

export default function ChatBubble(props: ChatBubbleProps) {
    const { content, variant, timestamp, sender } = props;
    const isYou = sender === "You";
    const isSent = variant === "sent";

    return (
        <Box sx={{ maxWidth: "60%", minWidth: 0 }}>
            <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between", mb: 0.25 }}>
                <Typography variant="caption" color="text.secondary">
                    {isYou ? "" : sender.name}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                    {timestamp}
                </Typography>
            </Stack>

            <Paper
                elevation={0}
                sx={{
                    p: 1.25,
                    borderRadius: 2,
                    borderTopRightRadius: isSent ? 0 : 2,
                    borderTopLeftRadius: isSent ? 2 : 0,
                    bgcolor: isSent ? "primary.main" : "background.paper",
                    color: isSent ? "primary.contrastText" : "text.primary",
                }}
            >
                <Typography
                    variant="body2"
                    sx={{ textAlign: isYou ? "right" : "left", overflowWrap: "anywhere" }}
                >
                    {content}
                </Typography>
            </Paper>
        </Box>
    );
}
