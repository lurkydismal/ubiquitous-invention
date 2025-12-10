// import { isDev } from './stdvar';
import { log } from "./stdlog";
import * as React from "react";
// import { user as devUser } from './testdata';
//
// interface UserCredentials {
//     id: number;
//     username: string;
// }
//
// export function storeCredentials(credentials: UserCredentials) {
//     if (isDev) {
//         log.debug('Skipping credential store in dev');
//
//         return;
//     }
//
//     log.debug(`Storing credentials for '${credentials.username}'`);
//
//     localStorage.setItem('id', String(credentials.id));
//     localStorage.setItem('username', credentials.username);
// }
//
// export function getCredentials(): UserCredentials {
//     if (isDev) {
//         log.debug(`Returning dev credentials: ${devUser}`);
//
//         return devUser;
//     }
//
//     const id = localStorage.getItem('id');
//     const username = localStorage.getItem('username');
//
//     if (!id || !username) {
//         log.error('Missing credentials');
//
//         throw new Error(`Getting credentials failed`);
//     }
//
//     return {
//         id: Number(id),
//         username,
//     };
// }

export function paginate<T>(
    items: T[],
    currentPage: number,
    perPage: number,
): T[] {
    log.trace(`Paginate page=${currentPage} size=${perPage}`);

    const start = (currentPage - 1) * perPage;
    const end = start + perPage;

    return items.slice(start, end);
}

export function openSidebar() {
    if (typeof window !== "undefined") {
        document.body.style.overflow = "hidden";
        document.documentElement.style.setProperty(
            "--SideNavigation-slideIn",
            "1",
        );
    }
}

export function closeSidebar() {
    if (typeof window !== "undefined") {
        document.documentElement.style.removeProperty(
            "--SideNavigation-slideIn",
        );
        document.body.style.removeProperty("overflow");
    }
}

export function toggleSidebar() {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
        const slideIn = window
            .getComputedStyle(document.documentElement)
            .getPropertyValue("--SideNavigation-slideIn");
        if (slideIn) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }
}

export function openMessagesPane() {
    if (typeof window !== "undefined") {
        document.body.style.overflow = "hidden";
        document.documentElement.style.setProperty(
            "--MessagesPane-slideIn",
            "1",
        );
    }
}

export function closeMessagesPane() {
    if (typeof window !== "undefined") {
        document.documentElement.style.removeProperty("--MessagesPane-slideIn");
        document.body.style.removeProperty("overflow");
    }
}

export function toggleMessagesPane() {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
        const slideIn = window
            .getComputedStyle(document.documentElement)
            .getPropertyValue("--MessagesPane-slideIn");
        if (slideIn) {
            closeMessagesPane();
        } else {
            openMessagesPane();
        }
    }
}

export type UseScriptStatus = "idle" | "loading" | "ready" | "error";

// Cached script statuses
const cachedScriptStatuses: Record<string, UseScriptStatus | undefined> = {};

/**
 * Simplified version of https://usehooks-ts.com/react-hook/use-script
 */
function getScriptNode(src: string) {
    const node: HTMLScriptElement | null = document.querySelector(
        `script[src="${src}"]`,
    );
    const status = node?.getAttribute("data-status") as
        | UseScriptStatus
        | undefined;

    return {
        node,
        status,
    };
}

export default function useScript(src: string): UseScriptStatus {
    const [status, setStatus] = React.useState<UseScriptStatus>(() => {
        if (typeof window === "undefined") {
            // SSR Handling - always return 'loading'
            return "loading";
        }

        return cachedScriptStatuses[src] ?? "loading";
    });

    React.useEffect(() => {
        const cachedScriptStatus = cachedScriptStatuses[src];
        if (cachedScriptStatus === "ready" || cachedScriptStatus === "error") {
            // If the script is already cached, set its status immediately
            setStatus(cachedScriptStatus);
            return;
        }

        // Fetch existing script element by src
        // It may have been added by another instance of this hook
        const script = getScriptNode(src);
        let scriptNode = script.node;

        if (!scriptNode) {
            // Create script element and add it to document body
            scriptNode = document.createElement("script");
            scriptNode.src = src;
            scriptNode.async = true;
            scriptNode.setAttribute("data-status", "loading");
            document.body.appendChild(scriptNode);

            // Store status in attribute on script
            // This can be read by other instances of this hook
            const setAttributeFromEvent = (event: Event) => {
                const scriptStatus: UseScriptStatus =
                    event.type === "load" ? "ready" : "error";

                scriptNode?.setAttribute("data-status", scriptStatus);
            };

            scriptNode.addEventListener("load", setAttributeFromEvent);
            scriptNode.addEventListener("error", setAttributeFromEvent);
        } else {
            // Grab existing script status from attribute and set to state.
            setStatus(script.status ?? cachedScriptStatus ?? "loading");
        }

        // Script event handler to update status in state
        // Note: Even if the script already exists we still need to add
        // event handlers to update the state for *this* hook instance.
        const setStateFromEvent = (event: Event) => {
            const newStatus = event.type === "load" ? "ready" : "error";
            setStatus(newStatus);
            cachedScriptStatuses[src] = newStatus;
        };

        // Add event listeners
        scriptNode.addEventListener("load", setStateFromEvent);
        scriptNode.addEventListener("error", setStateFromEvent);

        // Remove event listeners on cleanup
        // eslint-disable-next-line consistent-return
        return () => {
            if (scriptNode) {
                scriptNode.removeEventListener("load", setStateFromEvent);
                scriptNode.removeEventListener("error", setStateFromEvent);
            }

            if (scriptNode) {
                try {
                    scriptNode.remove();
                } catch (error) {
                    // ignore error
                }
            }
        };
    }, [src]);

    return status;
}
