import { getSessionData } from "@/lib/auth";
import { permanentRedirect } from "next/navigation";

export default async function Page() {
    const session = await getSessionData();

    if (!session) permanentRedirect("/auth/login");

    permanentRedirect("/dashboard");
}
