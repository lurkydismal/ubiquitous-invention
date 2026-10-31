"use client";

import { Box } from "@mui/material";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";

export default function Toggler(props: {
    defaultExpanded?: boolean;
    children: ReactNode;
    renderToggle: (params: {
        open: boolean;
        setOpen: Dispatch<SetStateAction<boolean>>;
    }) => ReactNode;
}) {
    const { defaultExpanded = false, renderToggle, children } = props;
    const [open, setOpen] = useState(defaultExpanded);

    return (
        <>
            {renderToggle({ open, setOpen })}

            <Box
                sx={{
                    display: "grid",
                    gridTemplateRows: open ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.2s ease",
                    "& > *": {
                        minHeight: 0,
                        overflow: "hidden",
                    },
                }}
            >
                {children}
            </Box>
        </>
    );
}
