"use client";

import { styled, Typography } from "@mui/material";

/* Truncated description */
export const Truncated = styled(Typography)({
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
    display: "-webkit-box",
    overflow: "hidden",
    textOverflow: "ellipsis",
});
