import { permanentRedirect } from "next/navigation";

import { getSessionDataAction } from "@/lib/auth";

export default async function Page() {
    const session = await getSessionDataAction();

    if (!session) permanentRedirect("/auth/login");

    permanentRedirect("/dashboard");
}
