"use client";

import { linkSx } from "@/data/styles";
import { postNewSchema } from "@/utils/validate/schemas";
import { Grid, styled } from "@mui/material";
import { ReactElement } from "react";
import { Path } from "react-hook-form";
import z from "zod";

export const stepSx = {
    ...linkSx,

    px: 1,
    py: 0.75,
    userSelect: "none",

    border: "1px solid",
    borderColor: "divider",

    "&::after": {
        transformOrigin: "left",
        bottom: 2,
    },

    "&:hover": {
        backgroundColor: "action.hover",
        transform: "translateY(-2px)",
    },

    "&:active": {
        transform: "translateY(0px)",
    },
};

export type FormValues = z.infer<typeof postNewSchema>;

export interface Step {
    title: string;
    fields: Path<FormValues>[];
    item: ReactElement;
}

export type MoveNext = () => void;

export const FormGrid = styled(Grid)(() => ({
    display: "flex",
    flexDirection: "column",
}));
