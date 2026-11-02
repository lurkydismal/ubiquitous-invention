import { redirect } from "next/navigation";

import { getSession } from "@/lib/dal/auth";

import SidebarClient from "./SidebarClient";

/**
 * Server component: keep session access and authorization on the server.
 */
export default async function Sidebar() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    const username = session.user.name?.trim() || session.user.email || "User";

    return <SidebarClient username={username} />;
}
