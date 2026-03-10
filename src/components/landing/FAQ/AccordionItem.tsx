import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
} from "@mui/material";
import { SyntheticEvent } from "react";

export default function AccordionItem({
    panel,
    question,
    answer,
    expanded,
    onChange,
}: {
    panel: string;
    question: string;
    answer: string;
    expanded: string[];
    onChange: (
        panel: string,
    ) => (e: SyntheticEvent, isExpanded: boolean) => void;
}) {
    return (
        <Accordion
            expanded={expanded.includes(panel)}
            onChange={onChange(panel)}
        >
            <AccordionSummary
                aria-controls={`${panel}d-content`}
                expandIcon={<ExpandMoreIcon />}
            >
                <Typography component="span" variant="subtitle2">
                    {question}
                </Typography>
            </AccordionSummary>

            <AccordionDetails>
                <Typography
                    gutterBottom
                    sx={{ maxWidth: { sm: "100%", md: "70%" } }}
                    variant="body2"
                >
                    {answer}
                </Typography>
            </AccordionDetails>
        </Accordion>
    );
}
