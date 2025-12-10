export const postRelations = relations(posts, ({ one }) => ({
    author: one(users, {
        fields: [posts.userId],
        references: [users.id],
    }),
}));

db.query.posts.findMany({ with: { author: true } });
