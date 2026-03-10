import MainFallback from "@/components/MainFallback";
import { SearchButton } from "@/components/SearchButton";
import { TagsAndSearchMobile } from "@/components/Tags";
import Latest from "@/components/posts/Latest";
import MainContent from "@/components/posts/MainContent";
import db from "@/db";
import { categories, posts, follows, users } from "@/db/schema";
import { getSessionData } from "@/lib/auth";
import { normalizeArrayOrValue } from "@/utils/stdfunc";
import { categorySelectSchema, postFullSchema } from "@/utils/validate/schemas";
import { desc, eq, inArray, or, aliasedTable } from "drizzle-orm";
import { unauthorized } from "next/navigation";

export default async function Posts() {
    const session = await getSessionData();
    if (!session) return unauthorized();

    const getInfoFromSession = async (
        session: NonNullable<Awaited<ReturnType<typeof getSessionData>>>,
    ) => {
        "use cache";

        const _posts = db.query.posts.findMany({
            orderBy: {
                created_at: "desc",
            },
            with: {
                author: true,
                coAuthor: true,
                category: true,
            },
        });

        const _userId = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.username, session.username))
            .limit(1)
            .execute();
        const userId = normalizeArrayOrValue(_userId);
        if (!userId || !userId.id) return unauthorized();

        const _followingIds = await db
            .select({ id: follows.following_id })
            .from(follows)
            .where(eq(follows.follower_id, userId.id))
            .execute();

        const followingIds = (_followingIds || [])
            .map((r) => r.id)
            .filter(Boolean);

        const authors = aliasedTable(users, "authors");
        const coAuthors = aliasedTable(users, "co_authors");

        const _featuredPosts = followingIds.length
            ? await db
                  .select({
                      id: posts.id,
                      title: posts.title,
                      description: posts.description,
                      content: posts.content,
                      preview_url: posts.preview_url,
                      created_at: posts.created_at,
                      updated_at: posts.updated_at,

                      author: {
                          id: authors.id,
                          username: authors.username,
                          avatar_url: authors.avatar_url,
                      },
                      coAuthor: {
                          id: coAuthors.id,
                          username: coAuthors.username,
                          avatar_url: coAuthors.avatar_url,
                      },
                      category: {
                          id: categories.id,
                          name: categories.name,
                      },
                  })
                  .from(posts)
                  .leftJoin(authors, eq(authors.id, posts.author_id)) // join author
                  .leftJoin(coAuthors, eq(coAuthors.id, posts.co_author_id)) // join coAuthor
                  .leftJoin(categories, eq(categories.id, posts.category_id)) // join category
                  .where(() =>
                      or(
                          inArray(posts.author_id, followingIds),
                          inArray(posts.co_author_id, followingIds),
                      ),
                  )
                  .orderBy(desc(posts.created_at))
                  .execute()
            : [];

        const _categories = db
            .select()
            .from(categories)
            .orderBy(desc(categories.name))
            .execute();

        const parsedPosts = postFullSchema.array().parse(await _posts);
        const parsedFeaturedPosts = postFullSchema
            .array()
            .parse(_featuredPosts);
        const parsedCategories = categorySelectSchema
            .array()
            .parse(await _categories);

        return { parsedPosts, parsedFeaturedPosts, parsedCategories };
    };

    const { parsedPosts, parsedFeaturedPosts, parsedCategories } =
        await getInfoFromSession(session);

    return (
        <MainFallback itemsLength={parsedPosts.length}>
            {parsedCategories.length && (
                <>
                    <SearchButton />

                    <TagsAndSearchMobile tags={parsedCategories} />
                </>
            )}

            {parsedFeaturedPosts.length && (
                <MainContent posts={parsedFeaturedPosts} />
            )}

            <Latest posts={parsedPosts} />
        </MainFallback>
    );
}
