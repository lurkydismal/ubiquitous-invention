"use client";

import Dashboard from "@/components/Dashboard";
import rows from "@/data/dashboard/tasks";

export default function Page() {
    return <Dashboard rows={rows} />;
}
