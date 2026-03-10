"use client";

import { items } from "@/data/landing/features";
import { useState } from "react";
import FeaturesSection from "./FeaturesSection";

export default function FeaturesClient({
    initialIndex,
}: {
    initialIndex: number;
}) {
    const [selectedItemIndex, setSelectedItemIndex] = useState(initialIndex);

    const handleItemClick = (index: number) => {
        setSelectedItemIndex(index);
    };

    const selectedFeature = items[selectedItemIndex];

    return (
        <FeaturesSection
            items={items}
            selectedItemIndex={selectedItemIndex}
            handleItemClick={handleItemClick}
            selectedFeature={selectedFeature}
        />
    );
}
