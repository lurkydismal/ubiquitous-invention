"use client";

import { Button, Stack, Typography } from "@mui/material";
import NextLink from "@/components/Link";

export default function FinalStep({ onReset }: { onReset: () => void }) {
    const id = 0;

    return (
        <Stack spacing={2} useFlexGap>
            <Typography variant="h1">📦</Typography>

            <Typography variant="h5">Thank you for contribution!</Typography>

            <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Your post link is <strong>{`/post/${id}`}</strong>
            </Typography>

            <Button
                variant="contained"
                sx={{ alignSelf: "start" }}
                onClick={() => onReset()}
                href="/profile/my"
                LinkComponent={NextLink}
            >
                Go to my profile
            </Button>
        </Stack>
    );
}
