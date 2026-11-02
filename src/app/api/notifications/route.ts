import { and, asc, count, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";

import db from "@/db";
import { notifications } from "@/db/schema";
import type { NotificationsRow } from "@/db/types";
import { emitNotificationEvent } from "@/lib/dashboard/common/change-events";
import { getSession } from "@/lib/dal/auth";

const notificationTypes = ["default", "success", "error", "warning", "info"] as const;
type NotificationType = NotificationsRow["type"];

const createNotificationSchema = z
    .object({
        type: z.enum(notificationTypes).optional(),
        message: z.string().trim().min(1).max(4_000),
    })
    .strict();

const updateNotificationsSchema = z
    .object({
        ids: z.array(z.number().int().positive()).min(1).max(500),
        isRead: z.boolean().optional(),
    })
    .strict();

async function isAuthenticated() {
    return Boolean(await getSession());
}

/** Reads notifications and the unread count for the toolbar. */
export async function GET(): Promise<Response> {
    if (!(await isAuthenticated())) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [rows, unreadResult] = await Promise.all([
        db.select().from(notifications).orderBy(asc(notifications.created_at)),
        db
            .select({ total: count() })
            .from(notifications)
            .where(eq(notifications.is_read, false)),
    ]);

    return Response.json({ rows, unreadCount: unreadResult[0]?.total ?? 0 });
}

/** Persists one validated notification and publishes it to connected clients. */
export async function POST(request: Request): Promise<Response> {
    if (!(await isAuthenticated())) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const parsed = createNotificationSchema.safeParse(body);
    if (!parsed.success) {
        return Response.json(
            { error: "Invalid notification payload", issues: parsed.error.issues },
            { status: 400 },
        );
    }

    const type: NotificationType = parsed.data.type ?? "default";
    const message = parsed.data.message;
    const [created] = await db.insert(notifications).values({ type, message }).returning();

    if (!created) {
        return Response.json({ error: "Unable to create notification" }, { status: 500 });
    }

    await emitNotificationEvent({
        event: "notification",
        notificationId: created.id,
        type: created.type,
        message: created.message,
        occurredAt: new Date().toISOString(),
    });

    return Response.json(created, { status: 201 });
}

/** Marks a bounded set of notifications as read or unread. */
export async function PATCH(request: Request): Promise<Response> {
    if (!(await isAuthenticated())) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const parsed = updateNotificationsSchema.safeParse(body);
    if (!parsed.success) {
        return Response.json(
            { error: "Invalid notification update", issues: parsed.error.issues },
            { status: 400 },
        );
    }

    const ids = [...new Set(parsed.data.ids)];
    const isRead = parsed.data.isRead ?? true;

    await db
        .update(notifications)
        .set({
            is_read: isRead,
            read_at: isRead ? sql`now()` : null,
        })
        .where(and(inArray(notifications.id, ids), eq(notifications.is_read, !isRead)));

    return Response.json({ ok: true });
}
