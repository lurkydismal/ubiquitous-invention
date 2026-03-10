"use client";

import { SyntheticEvent, useState } from "react";
import AccordionItem from "./AccordionItem";
import { items } from "@/data/landing/FAQ";
import { Container, Typography, Box } from "@mui/material";

export default function FAQ() {
    const [expanded, setExpanded] = useState<string[]>([]);

    const handleChange =
        (panel: string) => (_: SyntheticEvent, isExpanded: boolean) => {
            setExpanded(
                isExpanded
                    ? [...expanded, panel]
                    : expanded.filter((item) => item !== panel),
            );
        };

    return (
        <Container
            sx={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                gap: { xs: 3, sm: 6 },
                pb: { xs: 8, sm: 16 },
                position: "relative",
                pt: { xs: 4, sm: 12 },
            }}
        >
            <Typography
                component="h2"
                variant="h4"
                sx={{
                    color: "text.primary",
                    textAlign: { sm: "left", md: "center" },
                    width: { sm: "100%", md: "60%" },
                }}
            >
                Frequently asked questions
            </Typography>

            <Box sx={{ width: "100%" }}>
                {items.map((it) => (
                    <AccordionItem
                        key={it.panel}
                        panel={it.panel}
                        question={it.question}
                        answer={it.answer}
                        expanded={expanded}
                        onChange={handleChange}
                    />
                ))}
            </Box>
        </Container>
    );
}
