import "server-only";

import { AsyncLocalStorage } from "async_hooks";

export const cacheLifetimeStorage = new AsyncLocalStorage<{ time: number }>();
export function cacheLifetime(time: number) {
    const store = cacheLifetimeStorage.getStore();
    if (!store) throw new Error("cacheLifetime must be called within a cacheLifetimeStorage context");
    store.time = store.time ? Math.min(store.time, time) : time;
    console.log("cacheLifetime set to", store.time);
}
