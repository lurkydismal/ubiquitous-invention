import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
    users: {
        posts: r.many.posts({
            alias: "author",
        }),
        coAuthoredPosts: r.many.posts({
            alias: "coAuthor",
        }),
    },

    categories: {
        posts: r.many.posts(),
    },

    posts: {
        author: r.one.users({
            alias: "author",
            from: r.posts.author_id,
            to: r.users.id,
            optional: false,
        }),
        coAuthor: r.one.users({
            alias: "coAuthor",
            from: r.posts.co_author_id,
            to: r.users.id,
            optional: false,
        }),
        category: r.one.categories({
            from: r.posts.category_id,
            to: r.categories.id,
            optional: false,
        }),
    },
}));
