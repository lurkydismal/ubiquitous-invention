"use client";

import TasksGrid from "@/components/Dashboard/TasksGrid";
import rows from "@/data/mockTasksRows";
import { useSearchParams } from "next/navigation";

export default function Page() {
    const params = useSearchParams();

    const routeToStatusMap: Record<string, string> = {
        "in-progress": "In Progress",
        finished: "Finished",
        cancelled: "Cancelled",
        outdated: "Outdated",
    };
    const filterParam = params?.get("filter") ?? undefined;
    const statusFilter = filterParam
        ? routeToStatusMap[filterParam]
        : undefined;

    return (
        <TasksGrid showToolbar statusSearchFilter={statusFilter} rows={rows} />
    );
}
