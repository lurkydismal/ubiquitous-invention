import { UsersRowPublic } from "@/db/types";

import log from "./stdlog";
import { isServer, storageKeys } from "./stdvar";
import { userSelectPublicSchema } from "./validate/schemas";

export function setUser(user: UsersRowPublic | null) {
    if (isServer || !storageKeys.client) return;

    const storageKey = storageKeys.client.authStorageKey;

    if (user) localStorage.setItem(storageKey, JSON.stringify(user));
    else localStorage.removeItem(storageKey);
}

export function getUser(): UsersRowPublic | null {
    return {
        username: "123123",
        username_normalized: "123123",
        avatar_url: null,
    };

    // if (isServer || !storageKeys.client) return null;
    //
    // const storageKey = storageKeys.client.authStorageKey;
    //
    // const stored = localStorage.getItem(storageKey);
    //
    // const raw = stored ? JSON.parse(stored) : null;
    //
    // if (!raw) return null;
    //
    // try {
    //     const parsed = userSelectPublicSchema.parse(raw);
    //
    //     return parsed;
    // } catch (err) {
    //     log.error(err);
    //
    //     return null;
    // }
}
