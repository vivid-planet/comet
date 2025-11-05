import { createFetchRedisCache } from "@src/futureLib/fetchRedisCache";
import Redis from "ioredis";
import { LRUCache } from "lru-cache";

const REDIS_HOST = process.env.REDIS_HOST;
if (!REDIS_HOST) {
    throw new Error("REDIS_HOST is required");
}

const REDIS_PORT = parseInt(process.env.REDIS_PORT || "6379", 10);

const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
if (!REDIS_PASSWORD) {
    throw new Error("REDIS_PASSWORD is required");
}

const REDIS_KEY_PREFIX = process.env.REDIS_KEY_PREFIX || "";

export const fetchWithRedisCache = createFetchRedisCache(fetch, {
    redis: new Redis({
        enableOfflineQueue: false,
        host: REDIS_HOST,
        keyPrefix: REDIS_KEY_PREFIX,
        password: REDIS_PASSWORD,
        port: REDIS_PORT,
        enableAutoPipelining: true,
    }),
    fallbackCache: new LRUCache({
        maxSize: 50 * 1024 * 1024, // 50MB
        ttlAutopurge: true,
    }),
    ttl: 24 * 60 * 60, // 1 day,
    revalidate: 7.5 * 60, // set a default revalidate time of 7.5 minutes to get an effective cache duration of 15 minutes if a CDN cache is enabled
});
