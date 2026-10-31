"use client";

import { Box } from "@mui/joy";
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
                sx={[
                    {
                        display: "grid",
                        transition: "0.2s ease",
                        "& > *": {
                            overflow: "hidden",
                        },
                    },
                    open ? { gridTemplateRows: "1fr" } : { gridTemplateRows: "0fr" },
                ]}
            >
                {children}
            </Box>
        </>
    );
}
