import MainContent from "@/components/post/MainContent";
import { getSessionData } from "@/lib/auth";
import { getPostFull, requestPostFull } from "@/lib/post";
import { unauthorized } from "next/navigation";
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

    const id = z.number().parse(slug);

    const posts = await getPostFull(requestPostFull({ id }));

    return <MainContent post={posts} />;
}
