import MainContent from "@/components/profile/MainContent";
import { getSessionData } from "@/lib/auth";
import { getAllCategories, requestAllCategories } from "@/lib/category";
import { requestCheckUserFollowAction } from "@/lib/follow";
import { getAllPosts, requestAllPosts } from "@/lib/post";
import { getUser, getUserId, requestUser, requestUserId } from "@/lib/user";
import { awaitObject } from "@/utils/stdfunc";
import { cacheTag } from "next/cache";
import { forbidden, redirect, unauthorized } from "next/navigation";
import z from "zod";

export default async function Page({
    params,
}: {
    /**
     * Route parameters provided by Next.js App Router.
     *
     * `slug` uniquely identifies which tour configuration
     * should be loaded and rendered.
     */
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const session = await getSessionData();
    if (!session) return unauthorized();

    const parsedUsername = z
        .string()
        .trim()
        .min(1)
        .lowercase()
        .parse(decodeURIComponent(slug));

    if (session.username_normalized === parsedUsername) redirect("/profile/my");

    const getInfoFromSession = async (
        session: NonNullable<Awaited<ReturnType<typeof getSessionData>>>,
        parsedUsername: string,
    ) => {
        "use cache";
        cacheTag("follows");

        const userId = await getUserId(
            requestUserId(session.username_normalized),
        );
        const profileId = await getUserId(requestUserId(parsedUsername));

        if (!userId) return unauthorized();
        if (!profileId) return forbidden();
        if (userId === profileId) redirect("/profile/my");

        const _user = requestUser(profileId);
        const _posts = requestAllPosts();
        const _categories = requestAllCategories();
        const doesFollow = requestCheckUserFollowAction(userId, profileId);

        const user = getUser(_user);
        const posts = getAllPosts(_posts);
        const categories = getAllCategories(_categories);

        return await awaitObject({ user, posts, categories, doesFollow });
    };

    const {
        user: parsedUser,
        posts: parsedPosts,
        categories: parsedCategories,
        doesFollow,
    } = await getInfoFromSession(session, parsedUsername);

    return (
        <MainContent
            user={parsedUser}
            posts={parsedPosts}
            tags={parsedCategories}
            doesFollow={doesFollow}
        />
    );
}
