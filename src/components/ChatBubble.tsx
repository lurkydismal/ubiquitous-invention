import { MessageProps } from "./MyMessages/types";
import { Box, Sheet, Stack, Typography } from "@mui/joy";

type ChatBubbleProps = MessageProps & {
    variant: "sent" | "received";
};

export default function ChatBubble(props: ChatBubbleProps) {
    const {
        content,
        variant,
        timestamp,
        sender,
    } = props;
    const isYou = sender === "You";
    const isSent = variant === "sent";
    return (
        <Box sx={{ maxWidth: "60%", minWidth: "auto" }}>
            <Stack
                direction="row"
                spacing={2}
                sx={{ justifyContent: "space-between", mb: 0.25 }}
            >
                <Typography level="body-xs">
                    {isYou ? "" : sender.name}
                </Typography>

                <Typography level="body-xs">{timestamp}</Typography>
            </Stack>

            <Box sx={{ position: "relative" }}>
                <Sheet
                    color={isSent ? "primary" : "neutral"}
                    variant={isSent ? "solid" : "soft"}
                    sx={[
                        {
                            p: 1.25,
                            borderRadius: "lg",
                        },
                        isSent
                            ? {
                                borderTopRightRadius: 0,
                            }
                            : {
                                borderTopRightRadius: "lg",
                            },
                        isSent
                            ? {
                                borderTopLeftRadius: "lg",
                            }
                            : {
                                borderTopLeftRadius: 0,
                            },
                        isSent
                            ? {
                                backgroundColor:
                                    "var(--joy-palette-primary-solidBg)",
                            }
                            : {
                                backgroundColor: "background.body",
                            },
                    ]}
                >
                    <Typography
                        level="body-sm"
                        textAlign={isYou ? "end" : "start"}
                        sx={[
                            isSent
                                ? {
                                    color: "var(--joy-palette-common-white)",
                                }
                                : {
                                    color: "var(--joy-palette-text-primary)",
                                },
                        ]}
                    >
                        {content}
                    </Typography>
                </Sheet>
            </Box>
        </Box>
    );
}
