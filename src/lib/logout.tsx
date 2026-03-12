"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { clearAuthCookieAction } from "@/lib/auth";

export async function logoutAction() {
    const cookieStore = await cookies();

    await clearAuthCookieAction(cookieStore);

    redirect("/");
}
