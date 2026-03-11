"use server";

import db from "@/db";
import { users } from "@/db/schema";
import { normalizeArrayOrValue } from "@/utils/stdfunc";
import { userSelectPublicSchema } from "@/utils/validate/schemas";
import { eq, desc } from "drizzle-orm";

export async function requestUserIdAction(usernameNormalized: string) {
    "use cache";

    return db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.username_normalized, usernameNormalized))
        .limit(1)
        .execute();
}

export async function getUserIdAction(
    request: ReturnType<typeof requestUserIdAction>,
) {
    const userId = normalizeArrayOrValue(await request);
    if (userId && userId.id) return userId.id;

    return null;
}

export async function requestUserAction(uid: string | number) {
    "use cache";

    const field =
        typeof uid === "string" ? users.username_normalized : users.id;

    return db.select().from(users).where(eq(field, uid)).limit(1).execute();
}

export async function getUserAction(
    request: ReturnType<typeof requestUserAction>,
) {
    return userSelectPublicSchema.parse(normalizeArrayOrValue(await request));
}

export async function requestAllUsersAction() {
    "use cache";

    return db
        .select()
        .from(users)
        .orderBy(desc(users.username_normalized))
        .execute();
}

export async function getAllUsersAction(
    request: ReturnType<typeof requestAllUsersAction>,
) {
    return userSelectPublicSchema.array().parse(await request);
}
