"use server";

import log from "@/utils/stdlog";
import { getSessionData } from "@/lib/auth";
import { forbidden, unauthorized } from "next/navigation";
import { userSelectPublicSchema } from "@/utils/validate/schemas";
import db from "@/db";
import { follows, users } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { cacheTag, revalidateTag } from "next/cache";

async function manageFollow(
    username_normalized: string,
    action: "insert" | "remove",
) {
    // parse + validate input; throws on invalid input
    const parsedUser = userSelectPublicSchema
        .pick({
            username_normalized: true,
        })
        .parse({ username_normalized });

    const session = await getSessionData();
    if (!session) return unauthorized();

    log.trace(`Follow: ${parsedUser.username_normalized} as ${session}`);

    const normalizedUsername = parsedUser.username_normalized;

    try {
        const _users = await db
            .select({
                id: users.id,
                username_normalized: users.username_normalized,
            })
            .from(users)
            .where(
                inArray(users.username_normalized, [
                    session.username_normalized,
                    normalizedUsername,
                ]),
            );

        const userMap = new Map(
            _users.map((u) => [u.username_normalized, u.id]),
        );

        const followerId = userMap.get(session.username_normalized);
        const followingId = userMap.get(normalizedUsername);

        if (!followerId) return unauthorized();
        if (!followingId) return forbidden();
        if (followerId === followingId) return forbidden();

        const actionHandlers = {
            insert: async () => {
                await db
                    .insert(follows)
                    .values({
                        follower_id: followerId,
                        following_id: followingId,
                    })
                    .onConflictDoNothing()
                    .execute();
            },
            remove: async () => {
                await db
                    .delete(follows)
                    .where(
                        and(
                            eq(follows.follower_id, followerId),
                            eq(follows.following_id, followingId),
                        ),
                    )
                    .execute();
            },
        };

        await actionHandlers[action]();

        revalidateTag("follows", "max");
    } catch (err) {
        // Audit log: capture username and the error message, but do NOT log sensitive data.
        log.error(`follow ${action} failed`, {
            username: session.username,
            error: err instanceof Error ? err.message : String(err),
        });
        // Re-throw to let caller handle the error (keep message generic at higher level)
        throw err;
    }
}

export async function followAction(username_normalized: string) {
    manageFollow(username_normalized, "insert");
}

export async function unfollowAction(username_normalized: string) {
    manageFollow(username_normalized, "remove");
}

export async function requestCheckUserFollowAction(
    followerId: number,
    followingId: number,
): Promise<boolean> {
    "use cache";
    cacheTag("follows", "follow");

    const followRecord = await db
        .select()
        .from(follows)
        .where(
            and(
                eq(follows.follower_id, followerId),
                eq(follows.following_id, followingId),
            ),
        )
        .limit(1);

    return followRecord.length > 0;
}
