// db/schema.ts
import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
});

export const posts = pgTable("posts", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    userId: integer("user_id")
        .notNull()
        .references(() => users.id), // foreign key
});

// db/relations.ts
import { relations } from "drizzle-orm";
import { users, posts } from "./schema";

export const userRelations = relations(users, ({ many }) => ({
    posts: many(posts),
}));

export const postRelations = relations(posts, ({ one }) => ({
    author: one(users, {
        fields: [posts.userId],
        references: [users.id],
    }),
}));

// Get user with all posts
import { db } from "@/db/client";
import { users } from "@/db/schema";

const result = await db.query.users.findMany({
    with: {
        posts: true,
    },
});

// Get a post with its author
const post = await db.query.posts.findFirst({
    where: (p, { eq }) => eq(p.id, 1),
    with: { author: true },
});

// Profile example
export const profiles = pgTable("profiles", {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .unique()
        .references(() => users.id),
    bio: text("bio"),
});

export const userRelations = relations(users, ({ one }) => ({
    profile: one(profiles),
}));

export const profileRelations = relations(profiles, ({ one }) => ({
    user: one(users, {
        fields: [profiles.userId],
        references: [users.id],
    }),
}));

const user = await db.query.users.findFirst({
    with: { profile: true },
});

// Many-to-Many Relationship Example
export const articles = pgTable("articles", {
    id: serial("id").primaryKey(),
    title: text("title"),
});

export const tags = pgTable("tags", {
    id: serial("id").primaryKey(),
    name: text("name"),
});

export const articleTags = pgTable("article_tags", {
    articleId: integer("article_id")
        .notNull()
        .references(() => articles.id),
    tagId: integer("tag_id")
        .notNull()
        .references(() => tags.id),
});

export const articleRelations = relations(articles, ({ many }) => ({
    tags: many(articleTags),
}));

export const tagRelations = relations(tags, ({ many }) => ({
    articles: many(articleTags),
}));

export const articleTagRelations = relations(articleTags, ({ one }) => ({
    article: one(articles, {
        fields: [articleTags.articleId],
        references: [articles.id],
    }),
    tag: one(tags, {
        fields: [articleTags.tagId],
        references: [tags.id],
    }),
}));

await db.query.articles.findMany({
    with: {
        tags: {
            with: {
                tag: true,
            },
        },
    },
});
