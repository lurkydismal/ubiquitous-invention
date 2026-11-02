import { subscribeToDashboardEvents } from "@/lib/dashboard/common/change-events";
import { getSession } from "@/lib/dal/auth";

export const dynamic = "force-dynamic";

/** Opens an authenticated server-sent events stream for dashboard changes. */
export async function GET(request: Request): Promise<Response> {
    if (!(await getSession())) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let unsubscribe: (() => void) | null = null;
    let keepAlive: ReturnType<typeof setInterval> | null = null;
    let closed = false;
    let streamController: ReadableStreamDefaultController<Uint8Array> | null = null;

    const cleanup = () => {
        if (closed) return;
        closed = true;

        if (keepAlive) {
            clearInterval(keepAlive);
            keepAlive = null;
        }

        unsubscribe?.();
        unsubscribe = null;
        request.signal.removeEventListener("abort", cleanup);

        try {
            streamController?.close();
        } catch {
            // The client may already have cancelled the stream.
        }
    };

    const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
            streamController = controller;
            const encoder = new TextEncoder();

            const send = (payload: unknown) => {
                if (closed) return;

                try {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
                } catch {
                    cleanup();
                }
            };

            if (request.signal.aborted) {
                cleanup();
                return;
            }

            request.signal.addEventListener("abort", cleanup, { once: true });
            send({ type: "connected" });

            unsubscribe = await subscribeToDashboardEvents((event) => send(event));
            if (closed) {
                unsubscribe();
                unsubscribe = null;
                return;
            }

            keepAlive = setInterval(() => send({ type: "keepalive" }), 25_000);
        },
        cancel() {
            cleanup();
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "X-Accel-Buffering": "no",
        },
    });
}
