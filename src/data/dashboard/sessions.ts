import { LineSeries } from "@mui/x-charts";

const sessions: readonly LineSeries[] = [
    {
        area: true,
        curve: "linear",
        id: "created",
        label: "Created",
        showMark: false,
        stack: "total",
        stackOrder: "ascending",
        data: [
            300, 900, 600, 1200, 1500, 1800, 2400, 2100, 2700, 3000, 1800, 3300,
            3600, 3900, 4200, 4500, 3900, 4800, 5100, 5400, 4800, 5700, 6000,
            6300, 6600, 6900, 7200, 7500, 7800, 8100,
        ],
    },
    {
        area: true,
        curve: "linear",
        id: "finished",
        label: "Finished",
        showMark: false,
        stack: "total",
        stackOrder: "ascending",
        data: [
            1000, 1500, 1200, 1700, 1300, 2000, 2400, 2200, 2600, 2800, 2500,
            3000, 3400, 3700, 3200, 3900, 4100, 3500, 4300, 4500, 4000, 4700,
            5000, 5200, 4800, 5400, 5600, 5900, 6100, 6300,
        ],
    },
    {
        area: true,
        curve: "linear",
        id: "cancelled",
        label: "Cancelled",
        showMark: false,
        stack: "total",
        stackOrder: "ascending",
        data: [
            500, 900, 700, 1400, 1100, 1700, 2300, 2000, 2600, 2900, 2300, 3200,
            3500, 3800, 4100, 4400, 2900, 4700, 5000, 5300, 5600, 5900, 6200,
            6500, 5600, 6800, 7100, 7400, 7700, 8000,
        ],
    },
    {
        area: true,
        curve: "linear",
        id: "outdated",
        label: "Outdated",
        showMark: false,
        stack: "total",
        stackOrder: "ascending",
        data: [
            1000, 1500, 1200, 1700, 1300, 2000, 2400, 2200, 2600, 2800, 2500,
            3000, 3400, 3700, 3200, 3900, 4100, 3500, 4300, 4500, 4000, 4700,
            5000, 5200, 4800, 5400, 5600, 5900, 6100, 6300,
        ],
    },
];

export default sessions;
