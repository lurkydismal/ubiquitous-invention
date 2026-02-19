"use client";

import Dashboard from "@/components/Dashboard";
import rows from "@/data/mockTasksRows";

export default function Page() {
    return (
        <Dashboard rows={rows} />
    );
}
