import { unauthorized } from "next/navigation";

import { getSessionDataAction } from "@/lib/auth";

export default async function Template({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getSessionDataAction();

    if (!user) unauthorized();

    return children;
}
