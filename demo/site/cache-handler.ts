/* eslint-disable no-console */
import { Redis } from "ioredis";
import { LRUCache } from "lru-cache";
import { CacheHandler as NextCacheHandler } from "next/dist/server/lib/incremental-cache";

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

const CACHE_HANDLER_DEBUG = process.env.CACHE_HANDLER_DEBUG === "true";

const CACHE_TTL_IN_S = 24 * 60 * 60; // 1 day

const redis = new Redis({
    enableOfflineQueue: false,
    host: REDIS_HOST,
    keyPrefix: REDIS_KEY_PREFIX,
    password: REDIS_PASSWORD,
    port: REDIS_PORT,
    enableAutoPipelining: true,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fallbackCache = new LRUCache<string, any>({
    maxSize: 50 * 1024 * 1024, // 50MB
    ttl: CACHE_TTL_IN_S * 1000,
    ttlAutopurge: true,
});

let isFallbackInUse = false;

function parseBodyForGqlError(body: string) {
    try {
        const decodedBody = Buffer.from(body, "base64").toString("utf-8");
        if (!decodedBody.startsWith("{")) return null; // Not a JSON response, ignore
        return JSON.parse(decodedBody);
    } catch (error) {
        console.error("CacheHandler.parseBodyForGqlError error", error);
        return null;
    }
}

export default class CacheHandler extends NextCacheHandler {
    //constructor(_ctx: NextCacheHandlerContext) {}

    async get(
        key: string,
        //ctx: Parameters<NextCacheHandler["get"]>[1]
    ): ReturnType<NextCacheHandler["get"]> {
        if (redis.status === "ready") {
            try {
                if (CACHE_HANDLER_DEBUG) {
                    console.log("CacheHandler.get redis", key);
                }

                const redisResponse = await redis.get(key);
                if (isFallbackInUse) {
                    isFallbackInUse = false;
                    console.info(`${new Date().toISOString()} [${REDIS_HOST} up] Switching back to redis cache`);
                }
                if (!redisResponse) {
                    return null;
                }
                return JSON.parse(redisResponse);
            } catch (e) {
                console.error("CacheHandler.get error", e);
            }
        }

        if (CACHE_HANDLER_DEBUG) {
            console.log("CacheHandler.get fallbackCache", key);
        }

        // fallback to in-memory cache
        if (!isFallbackInUse) {
            console.warn(`${new Date().toISOString()} | [${REDIS_HOST} down] switching to fallback in-memory cache`);
            isFallbackInUse = true;
        }

        return fallbackCache.get(key) ?? null;
    }

    async set(
        key: string,
        value: Parameters<NextCacheHandler["set"]>[1],
        // ctx: Parameters<NextCacheHandler["set"]>[2],
    ): Promise<void> {
        if (value?.kind === "FETCH") {
            const responseBody = parseBodyForGqlError(value.data.body);
            if (responseBody?.errors) {
                // Must not cache GraphQL errors
                console.error("CacheHandler.set GraphQL Error: ", responseBody.error);
                return;
            }
        }

        const stringData = JSON.stringify({
            lastModified: Date.now(),
            value,
        });

        if (redis.status === "ready") {
            try {
                if (CACHE_HANDLER_DEBUG) {
                    console.log("CacheHandler.set redis", key);
                }
                await redis.set(key, stringData, "EX", CACHE_TTL_IN_S);
            } catch (e) {
                console.error("CacheHandler.set error", e);
            }
        }
        if (CACHE_HANDLER_DEBUG) {
            console.log("CacheHandler.set fallbackCache", key);
        }
        fallbackCache.set(key, value, { size: stringData.length });
    }

    async revalidateTag(tags: string | string[]): Promise<void> {
        console.log("CacheHandler.revalidateTag", tags);
        throw new Error("unsupported");
    }
}
