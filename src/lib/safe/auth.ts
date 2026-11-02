"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import auth from "@/lib/auth";
import { loginUserSchema, registerUserSchema } from "@/utils/validate/schemas";

import { actionClient } from "./client";

export const register = actionClient
    .inputSchema(registerUserSchema)
    .action(async ({ parsedInput }) => {
        await auth.api.signUpEmail({ body: parsedInput });

        redirect("/");
    });

export const login = actionClient.inputSchema(loginUserSchema).action(async ({ parsedInput }) => {
    const { remember, ...credentials } = parsedInput;

    await auth.api.signInEmail({
        body: {
            ...credentials,
            ...(remember === undefined ? {} : { rememberMe: remember }),
        },
    });

    redirect("/");
});

/** Signs out the current Better Auth session. */
export async function logout(): Promise<void> {
    await auth.api.signOut({ headers: await headers() });
}
