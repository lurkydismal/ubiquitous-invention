import { categories, posts, users } from "./schema";

export type UsersRow = typeof users.$inferSelect;
export type UsersRowInsert = typeof users.$inferInsert;
export type UsersRowPublic = Omit<UsersRow, "id" | "password_hash" | "created_at" | "updated_at">;

export type CategoriesRow = typeof categories.$inferSelect;
export type CategoriesRowInsert = typeof categories.$inferInsert;
export type CategoriesRowPublic = Omit<CategoriesRow, "id" | "created_at" | "updated_at">;

export type PostsRow = typeof posts.$inferSelect;
export type PostsRowInsert = typeof posts.$inferInsert;
export type PostsRowFull = Omit<PostsRow, "author_id" | "co_author_id" | "category_id"> & {
    author: UsersRowPublic | null;
    coAuthor: UsersRowPublic | null;
    category: CategoriesRowPublic | null;
};
