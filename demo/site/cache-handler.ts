/* eslint-disable no-console */
import { Redis } from "ioredis";
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

const REDIS_ENABLE_AUTOPIPELINING = process.env.REDIS_ENABLE_AUTOPIPELINING === "true";

const CACHE_HANDLER_DEBUG = process.env.CACHE_HANDLER_DEBUG === "true";

const CACHE_TTL_IN_S = 24 * 60 * 60; // 1 day

const redis = new Redis({
    commandTimeout: 1000,
    enableOfflineQueue: false,
    host: REDIS_HOST,
    keyPrefix: REDIS_KEY_PREFIX,
    password: REDIS_PASSWORD,
    port: REDIS_PORT,
    socketTimeout: 1000,
    enableAutoPipelining: REDIS_ENABLE_AUTOPIPELINING, // https://github.com/redis/ioredis?tab=readme-ov-file#autopipelining
});

const fallbackCache = new LRUCache({
    maxSize: 50 * 1024 * 1024, // 50MB
    ttl: CACHE_TTL_IN_S * 1000,
    ttlAutopurge: true,
});

let isFallbackInUse = false;

function parseBody(body) {
    if (!body) {
        return null;
    }

    try {
        return JSON.parse(Buffer.from(body, "base64").toString("utf-8"));
    } catch (error) {
        console.error("CacheHandler.parseBodyData error", error);
        return null;
    }
}

export default class CacheHandler {
    async get(key) {
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

        return fallbackCache.get(key);
    }

    async set(key, value, ctx) {
        const responseBody = parseBody(value?.data?.body);
        if (responseBody?.errors) {
            // Must not cache GraphQL errors
            console.error("CacheHandler.set GraphQL Error: ", responseBody.error);

            return;
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
                return redis.set(key, stringData, "EX", CACHE_TTL_IN_S);
            } catch (e) {
                console.error("CacheHandler.set error", e);
            }
        }
        if (CACHE_HANDLER_DEBUG) {
            console.log("CacheHandler.set fallbackCache", key);
        }
        return fallbackCache.set(key, value, { size: stringData.length });
    }

    async revalidateTag(tag) {
        console.log("CacheHandler.revalidateTag", tag);
        throw new Error("unsupported");
    }
}
