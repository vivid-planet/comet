import { createCache, memoryStore } from "cache-manager";

export const memoryCache = createCache(
    memoryStore({
        ttl: process.env.NODE_ENV === "development" ? 0 : 15 * 60 * 1000, // 15 minutes,
    }),
    {
        refreshThreshold: 5 * 60 * 1000, // refresh if less than 5 minutes TTL are remaining,
        onBackgroundRefreshError: (error) => {
            console.error("Error refreshing cache in background", error);
        },
    },
);
