import SidebarClient from "./SidebarClient";

/**
 * Server wrapper for the interactive sidebar.
 */
export default function Sidebar({ username }: Readonly<{ username: string }>) {
    return <SidebarClient username={username} />;
}
