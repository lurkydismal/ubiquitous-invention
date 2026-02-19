"use client";

import { PrismAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import {
    oneDark as darkTheme,
    oneLight as lightTheme,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import {
    Check as CheckIcon,
    ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";
import { useColorScheme } from "@mui/material/styles";
import Mermaid from "@/components/Mermaid";
import { gray } from "@/theme/themePrimitives";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useSnackbar } from "@/components/SnackbarProvider";

/**
 * CodeBlock component
 *
 * Renders either inline or block code with syntax highlighting.
 * Supports dynamic language detection, code copying, and Mermaid diagrams.
 *
 * @param inline - If true, renders code inline instead of a block
 * @param className - Optional class name (used for detecting language)
 * @param children - Code content
 * @param props - Other props passed to underlying components
 */
export default function CodeBlock({
    inline,
    className,
    children,
    ...props
}: {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
    node?: unknown;
}) {
    const { showInfo } = useSnackbar();

    // Access Material UI theme for dynamic styling
    const { mode } = useColorScheme();

    // Detect language dynamically
    const match = /language-(\w+)/.exec(className || "");

    // State for managing clipboard copy feedback
    const [copied, setCopied] = useState(false);

    // Reset "copied" state after 2 seconds
    useEffect(() => {
        if (!copied) return;

        const t = setTimeout(() => setCopied(false), 2000);

        return () => clearTimeout(t);
    }, [copied]);

    // Convert children to string and trim trailing whitespace
    const { trimmed, lineAmount } = useMemo(() => {
        const text = Array.isArray(children)
            ? children.join("")
            : String(children);
        const trimmedText = text.trimEnd();
        return {
            trimmed: trimmedText,
            lineAmount: trimmedText.split("\n").length,
        };
    }, [children]);

    /**
     * Copy text to clipboard
     * Sets `copied` state to true if successful, false otherwise
     * @param s - Text to copy
     */
    const copyToClipboard = useCallback(
        async (s: string) => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                try {
                    await navigator.clipboard.writeText(s);

                    setCopied(true);

                    showInfo("Copied to clipboard");

                    return;
                } catch {
                    setCopied(false);
                }
            }
        },
        [showInfo],
    );

    // Memoize the syntax highlighting theme based on the current MUI theme mode
    const syntaxTheme = mode === "dark" ? darkTheme : lightTheme;

    // Inline code or unknown language fallback
    if (inline || !match) {
        return (
            <Typography
                {...props}
                component="code"
                sx={[
                    () => ({
                        fontSize: "0.875rem",
                        borderRadius: 1,
                        px: 1,
                        py: 0,
                        backgroundColor: gray[200],
                        color: gray[900],
                    }),
                    (theme) =>
                        theme.applyStyles("dark", {
                            backgroundColor: gray[800],
                            color: gray[100],
                        }),
                ]}
            >
                {children}
            </Typography>
        );
    }

    // Detected language from className
    const lang = match[1];

    // If language is mermaid, render the Mermaid diagram component
    if (lang === "mermaid") {
        return <Mermaid chart={String(children).trim()} />;
    }

    return (
        <Box position="relative" sx={{ mt: 2, mb: 2 }}>
            {/* Copy button positioned at top-right */}
            <Box
                sx={{
                    alignItems: "center",
                    display: "flex",
                    gap: 1,
                    position: "absolute",
                    right: 8,
                    top: 8,
                    zIndex: 3,
                }}
            >
                <Tooltip title={copied ? "Copied" : "Copy"} arrow>
                    <IconButton
                        aria-label="Copy code"
                        onClick={() => copyToClipboard(trimmed)}
                        size="small"
                        sx={[
                            () => ({
                                bgcolor: "rgba(0,0,0,0.04)",
                                "&:hover": {
                                    bgcolor: "rgba(0,0,0,0.08)",
                                },
                            }),
                            (theme) =>
                                theme.applyStyles("dark", {
                                    bgcolor: "rgba(255,255,255,0.04)",
                                    "&:hover": {
                                        bgcolor: "rgba(255,255,255,0.06)",
                                    },
                                }),
                        ]}
                    >
                        {/* Show check icon if copied, otherwise copy icon */}
                        {copied ? (
                            <CheckIcon fontSize="small" />
                        ) : (
                            <ContentCopyIcon fontSize="small" />
                        )}
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Syntax highlighted code block */}
            <SyntaxHighlighter
                {...props}
                PreTag="div"
                language={lang}
                showLineNumbers={lineAmount > 1}
                style={syntaxTheme}
            >
                {trimmed}
            </SyntaxHighlighter>
        </Box>
    );
}
