import TasksGrid from "@/components/Dashboard/TasksGrid";
import rows from "@/data/dashboard/tasks";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { filter } = await searchParams;

    // Normalize filter: take the first string if it's an array, else undefined
    const normalizedFilter =
        typeof filter === "string"
            ? filter
            : Array.isArray(filter)
                ? filter[0] // take the first value if multiple
                : undefined;

    const routeToStatusMap: Record<string, string> = {
        "in-progress": "In Progress",
        finished: "Finished",
        cancelled: "Cancelled",
        outdated: "Outdated",
    };
    const statusFilter = normalizedFilter
        ? routeToStatusMap[normalizedFilter]
        : undefined;

    return (
        <TasksGrid
            key={statusFilter}
            showToolbar
            statusSearchFilter={statusFilter}
            rows={rows}
        />
    );
}
