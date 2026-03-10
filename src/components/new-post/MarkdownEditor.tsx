"use client";

import { Box } from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";

interface Props {
    value: string;
    onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: Props) {
    return (
        <Box
            sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                minHeight: 0, // VERY IMPORTANT for flex children
            }}
        >
            <CodeMirror
                value={value}
                height="100%"
                extensions={[markdown(), EditorView.lineWrapping]}
                theme={oneDark}
                onChange={(val) => onChange(val)}
                style={{
                    flex: 1,
                    fontSize: "14px",
                }}
            />
        </Box>
    );
}
