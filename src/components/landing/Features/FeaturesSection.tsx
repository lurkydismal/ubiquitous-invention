"use client";

import { Box, Card } from "@mui/material";
import FeatureList from "./FeaturesList";
import { FeatureItem } from "@/data/landing/features";
import { CSSProperties } from "react";

export default function FeaturesSection({
    items,
    selectedItemIndex,
    handleItemClick,
    selectedFeature,
}: {
    items: FeatureItem[];
    handleItemClick: (index: number) => void;
    selectedFeature: FeatureItem;
    selectedItemIndex: number;
}) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row-reverse" },
                gap: 2,
            }}
        >
            <FeatureList
                items={items}
                selectedItemIndex={selectedItemIndex}
                handleItemClick={handleItemClick}
                selectedFeature={selectedFeature}
            />

            <Box
                sx={{
                    display: { xs: "none", sm: "flex" },
                    height: "var(--items-image-height)",
                    width: { xs: "100%", md: "70%" },
                }}
            >
                <Card
                    variant="outlined"
                    sx={{
                        display: { xs: "none", sm: "flex" },
                        height: "100%",
                        pointerEvents: "none",
                        width: "100%",
                    }}
                >
                    <Box
                        sx={(theme) => ({
                            backgroundImage: "var(--items-imageLight)",
                            backgroundSize: "contain",
                            height: 500,
                            m: "auto",
                            width: 420,
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
                </Card>
            </Box>
        </Box>
    );
}
