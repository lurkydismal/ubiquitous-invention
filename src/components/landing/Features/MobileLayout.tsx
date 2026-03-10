"use client";

import { FeatureItem } from "@/data/landing/features";
import {
    Box,
    Card,
    CSSProperties,
    Chip as MuiChip,
    styled,
    Typography,
} from "@mui/material";

interface ChipProps {
    selected?: boolean;
}

const Chip = styled(MuiChip)<ChipProps>(({ theme }) => ({
    variants: [
        {
            props: ({ selected }) => !!selected,
            style: {
                background:
                    "linear-gradient(to bottom right, hsl(210, 98%, 48%), hsl(210, 98%, 35%))",
                color: "hsl(0, 0%, 100%)",
                borderColor: (theme.vars || theme).palette.primary.light,
                "& .MuiChip-label": {
                    color: "hsl(0, 0%, 100%)",
                },
                ...theme.applyStyles("dark", {
                    borderColor: (theme.vars || theme).palette.primary.dark,
                }),
            },
        },
    ],
}));

interface MobileLayoutProps {
    items: FeatureItem[];
    handleItemClick: (index: number) => void;
    selectedFeature: FeatureItem;
    selectedItemIndex: number;
}

export default function MobileLayout({
    items,
    selectedItemIndex,
    handleItemClick,
    selectedFeature,
}: MobileLayoutProps) {
    if (!items[selectedItemIndex]) {
        return null;
    }

    return (
        <Box
            sx={{
                display: { xs: "flex", sm: "none" },
                flexDirection: "column",
                gap: 2,
            }}
        >
            <Box sx={{ display: "flex", gap: 2, overflow: "auto" }}>
                {items.map(({ title }, index) => (
                    <Chip
                        key={index}
                        label={title}
                        onClick={() => handleItemClick(index)}
                        selected={selectedItemIndex === index}
                        size="medium"
                    />
                ))}
            </Box>

            <Card variant="outlined">
                <Box
                    sx={(theme) => ({
                        backgroundImage: "var(--items-imageLight)",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        mb: 2,
                        minHeight: 280,
                        ...theme.applyStyles("dark", {
                            backgroundImage: "var(--items-imageDark)",
                        }),
                    })}
                    style={
                        items[selectedItemIndex]
                            ? ({
                                  "--items-imageDark":
                                      items[selectedItemIndex].imageDark,
                                  "--items-imageLight":
                                      items[selectedItemIndex].imageLight,
                              } as CSSProperties)
                            : {}
                    }
                />

                <Box sx={{ px: 2, pb: 2 }}>
                    <Typography
                        gutterBottom
                        sx={{ color: "text.primary", fontWeight: "medium" }}
                    >
                        {selectedFeature.title}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", mb: 1.5 }}
                    >
                        {selectedFeature.description}
                    </Typography>
                </Box>
            </Card>
        </Box>
    );
}
