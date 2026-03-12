import {
    varchar,
    serial,
    pgTable,
    text,
    check,
    smallint,
    integer,
    index,
    primaryKey,
    boolean,
    pgEnum,
    timestamp,
} from "drizzle-orm/pg-core";
import { timestamps } from "./helpers";
import { sql } from "drizzle-orm";

export const users = pgTable(
    "users",
    {
        id: serial().primaryKey(),
        username: varchar({ length: 32 }).unique().notNull(),
        username_normalized: varchar({ length: 32 }).unique().notNull(),
        password_hash: text().notNull(),
        avatar_url: varchar({ length: 255 }),
        ...timestamps,
    },
    (t) => [
        check("username_not_blank", sql`length(trim(${t.username})) > 0`),
        check(
            "username_normalized_not_blank",
            sql`length(trim(${t.username_normalized})) > 0`,
        ),
        check(
            "username_normalized_lowercase",
            sql`${t.username_normalized} = lower(${t.username_normalized})`,
        ),
        check(
            "avatar_url_not_blank",
            sql`${t.avatar_url} IS NULL OR length(trim(${t.avatar_url})) > 0`,
        ),
    ],
);

export const follows = pgTable(
    "follows",
    {
        follower_id: integer()
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        following_id: integer()
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        created_at: timestamps.created_at,
    },
    (t) => [
        primaryKey({ columns: [t.follower_id, t.following_id] }),

        check(
            "follower_cannot_follow_themselves",
            sql`follower_id != following_id`,
        ),

        index().on(t.follower_id),
        index().on(t.following_id),
    ],
);

export const categories = pgTable(
    "categories",
    {
        id: serial().primaryKey(),
        name: varchar({ length: 50 }).unique().notNull(),
        ...timestamps,
    },
    (t) => [check("name_not_blank", sql`length(trim(${t.name})) > 0`)],
);

export const postVisibilityEnum = pgEnum("post_visibility", [
    "public",
    "unlisted",
    "private",
]);

export const posts = pgTable(
    "posts",
    {
        id: serial().primaryKey(),
        author_id: integer().references(() => users.id, {
            onDelete: "set null",
        }),
        co_author_id: integer().references(() => users.id, {
            onDelete: "set null",
        }),
        category_id: integer().references(() => categories.id, {
            onDelete: "set null",
        }),
        title: varchar({ length: 50 }).notNull(),
        description: varchar({ length: 100 }),
        content: text().notNull(),
        content_warning: boolean().default(false).notNull(),
        visibility: postVisibilityEnum().default("public").notNull(),
        scheduled_at: timestamp({ precision: 0, withTimezone: true })
            .defaultNow()
            .notNull(),
        reading_time: smallint().notNull(),
        ...timestamps,
    },
    (t) => [
        check("title_longer_than_10", sql`length(trim(${t.title})) > 10`),
        check(
            "description_longer_than_10",
            sql`${t.description} IS NULL OR length(trim(${t.description})) > 10`,
        ),
        check("content_longer_than_100", sql`length(trim(${t.content})) > 100`),
        check("scheduled_at_not_in_past", sql`${t.scheduled_at} >= NOW()`),
        check("reading_time_not_blank", sql`${t.reading_time} > 0`),

        index().on(t.author_id),
        index().on(t.co_author_id),
        index().on(t.category_id),

        index().on(t.author_id, t.created_at.desc()),
    ],
);
