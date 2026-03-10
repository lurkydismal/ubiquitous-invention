"use client";

import {
    Grid,
    FormLabel,
    OutlinedInput,
    Card,
    Box,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import {
    useCallback,
    useDeferredValue,
    useEffect,
    useRef,
    useState,
} from "react";
import MarkdownEditor from "./MarkdownEditor";
import Markdown from "../Markdown";
import { useWordStats } from "@/utils/stdhook";
import { formatReadingTime } from "@/utils/stdfunc";
import { FormGrid } from "./types";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { throttle } from "lodash";

function ResizableSplitPane({
    left,
    right,
}: Readonly<{
    left: React.ReactNode;
    right: React.ReactNode;
}>) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [leftWidth, setLeftWidth] = useState(50); // percentage

    const throttledSetLeftWidth = useCallback(
        throttle((newLeftWidth: number) => {
            // Set leftWidth, but make sure it's within bounds
            if (newLeftWidth > 10 && newLeftWidth < 90) {
                setLeftWidth(newLeftWidth);
            }
        }, 100), // Throttling at 100ms interval
        [],
    );

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        const handlePointerMove = (e: PointerEvent) => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100;

            throttledSetLeftWidth(newLeftWidth);
        };

        const handlePointerUp = () => {
            document.removeEventListener("pointermove", handlePointerMove);
            document.removeEventListener("pointerup", handlePointerUp);
        };

        document.addEventListener("pointermove", handlePointerMove);
        document.addEventListener("pointerup", handlePointerUp);

        // Prevent text selection while dragging
        e.preventDefault();
    };

    return (
        <Box
            ref={containerRef}
            sx={{
                display: "flex",
                height: "80vh",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* LEFT SIDE */}
            <Box
                sx={{
                    width: `${leftWidth}%`,
                    overflow: "auto",
                    display: "flex",
                }}
            >
                {left}
            </Box>

            {/* DRAG HANDLE */}
            <Box
                onPointerDown={handlePointerDown}
                sx={{
                    width: "6px",
                    cursor: "col-resize",
                    backgroundColor: "divider",
                    "&:hover": {
                        backgroundColor: "primary.main",
                    },
                }}
            />

            {/* RIGHT SIDE */}
            <Box
                sx={{
                    width: `${100 - leftWidth}%`,
                    overflow: "auto",
                    p: 2,
                }}
            >
                {right}
            </Box>
        </Box>
    );
}

function MyMarkdown() {
    const { control } = useFormContext();

    const content = useWatch({ name: "content" });

    const deferredContent = useDeferredValue(content);

    return (
        <Grid size={{ xs: 12, md: 12 }}>
            <Card>
                <ResizableSplitPane
                    left={
                        <Controller
                            name="content"
                            control={control}
                            render={({ field }) => (
                                <MarkdownEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    }
                    right={<Markdown>{deferredContent}</Markdown>}
                />
            </Card>
        </Grid>
    );
}

export default function WriteForm() {
    const { control, setValue } = useFormContext();
    const content = useWatch({ name: "content" });
    const { wordCount, readingTime } = useWordStats(content);

    useEffect(() => {
        setValue("reading-time", readingTime, {
            shouldValidate: true,
            shouldDirty: true,
        });
    }, [readingTime, setValue]);

    return (
        <Grid container spacing={2}>
            <FormGrid size={{ xs: 12, md: 12 }}>
                <FormLabel htmlFor="title" required>
                    Title
                </FormLabel>

                <Controller
                    name="title"
                    control={control}
                    render={({ field, fieldState }) => (
                        <OutlinedInput
                            {...field}
                            autoComplete="title"
                            placeholder="Title"
                            size="small"
                            error={!!fieldState.error}
                        />
                    )}
                />
            </FormGrid>

            <FormGrid size={{ xs: 12, md: 12 }}>
                <FormLabel htmlFor="description">Description</FormLabel>

                <Controller
                    name="description"
                    control={control}
                    render={({ field, fieldState }) => (
                        <OutlinedInput
                            {...field}
                            autoComplete="description"
                            placeholder="Description"
                            size="small"
                            error={!!fieldState.error}
                        />
                    )}
                />
            </FormGrid>

            <MyMarkdown />

            <Grid size={{ xs: 12, md: 12 }}>
                <List disablePadding>
                    <ListItem>
                        <ListItemText
                            primary="Reading time"
                            secondary={formatReadingTime(readingTime)}
                        />

                        <ListItemText
                            primary="Word count"
                            secondary={wordCount}
                        />
                    </ListItem>
                </List>
            </Grid>
        </Grid>
    );
}
