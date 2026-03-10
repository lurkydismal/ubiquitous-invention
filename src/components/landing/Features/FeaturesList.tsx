"use client";

import { FeatureItem } from "@/data/landing/features";
import MobileLayout from "./MobileLayout";
import { Box, Button, Typography } from "@mui/material";

export default function FeatureList({
    items,
    selectedItemIndex,
    handleItemClick,
    selectedFeature,
}: {
    items: FeatureItem[];
    selectedItemIndex: number;
    handleItemClick: (index: number) => void;
    selectedFeature: FeatureItem;
}) {
    return (
        <>
            <Box
                sx={{
                    display: { xs: "none", sm: "flex" },
                    flexDirection: "column",
                    gap: 2,
                    height: "100%",
                }}
            >
                {items.map(({ icon, title, description }, index) => (
                    <Box
                        component={Button}
                        key={index}
                        onClick={() => handleItemClick(index)}
                        sx={[
                            (theme) => ({
                                height: "100%",
                                p: 2,
                                width: "100%",
                                "&:hover": {
                                    backgroundColor: (theme.vars || theme)
                                        .palette.action.hover,
                                },
                            }),
                            selectedItemIndex === index && {
                                backgroundColor: "action.selected",
                            },
                        ]}
                    >
                        <Box
                            sx={[
                                {
                                    alignItems: "left",
                                    color: "text.secondary",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1,
                                    textAlign: "left",
                                    textTransform: "none",
                                    width: "100%",
                                },
                                selectedItemIndex === index && {
                                    color: "text.primary",
                                },
                            ]}
                        >
                            {icon}

                            <Typography variant="h6">{title}</Typography>

                            <Typography variant="body2">
                                {description}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>

            <MobileLayout
                items={items}
                handleItemClick={handleItemClick}
                selectedFeature={selectedFeature}
                selectedItemIndex={selectedItemIndex}
            />
        </>
    );
}
