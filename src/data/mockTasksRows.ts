import { GridRowsProp } from "@mui/x-data-grid";
import dayjs from "dayjs";

function now() {
    return dayjs().format("HH:mm YYYY-MM-DD");
}

const statuses = ["In Progress", "Finished", "Cancelled", "Outdated"];
const tags = ["R&D", "Frontend", "Backend", "QA", "Design"];
const authors = ["ME", "Alice", "Bob", "Charlie"];
const trackers = ["Also me", "Jira", "Linear", "GitHub"];

function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

// random date between two dates
function randomDate(start: dayjs.Dayjs, end: dayjs.Dayjs) {
    const diff = end.valueOf() - start.valueOf();
    return dayjs(start.valueOf() + Math.random() * diff).format();
}

function generateTasks(count = 1000) {
    const now = dayjs();

    return Array.from({ length: count }, (_, i) => {
        const createdAt = randomDate(now.subtract(90, "day"), now);
        const updatedAt = randomDate(dayjs(createdAt), now);
        const endDate = randomDate(now, now.add(90, "day"));

        return {
            id: i + 1,
            title: `Task ${i + 1}`,
            status: randomItem(statuses),
            createdAt,
            updatedAt,
            endDate,
            tag: randomItem(tags),
            author: randomItem(authors),
            tracker: randomItem(trackers),
        };
    });
}

const rows = generateTasks(20).map((item, index) => {
    return {
        ...item,
        ...(item.id == null ? { id: index + 1 } : {}),
        ...(item.createdAt == null ? { createdAt: now() } : {}),
        ...(item.updatedAt == null ? { updatedAt: now() } : {}),
        ...(item.endDate == null ? { endDate: now() } : {}),
    };
}) as Readonly<GridRowsProp>;

export default rows;
