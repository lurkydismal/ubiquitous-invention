import { BarSeries } from "@mui/x-charts";

const views: readonly BarSeries[] = [
    {
        data: [4051, 2275, 3129, 4693, 3904, 2038, 2275, 2275, 2275, 2275, 2275, 2275],
        id: "tasks-changed",
        label: "Tasks changed",
        stack: "A",
    },
    {
        data: [2234, 3872, 2998, 4125, 3357, 2789, 2998, 2998, 2998, 2998, 2998, 2998],
        id: "messages-sended",
        label: "Messages sended",
        stack: "A",
    },
    {
        data: [3098, 4215, 2384, 2101, 4752, 3593, 2384, 2384, 2384, 2384, 2384, 2384],
        id: "users-online",
        label: "Users online",
        stack: "A",
    },
];

export default views;
