/* eslint-disable no-console */
/* eslint-disable no-undef */

import { Redis } from "ioredis";
import { LRUCache } from 'lru-cache'

const REDIS_SENTINEL_HOST = process.env.REDIS_SENTINEL_HOST;
if (!REDIS_SENTINEL_HOST) {
    throw new Error("REDIS_SENTINEL_HOST is required");
}

const REDIS_SENTINEL_PORT = process.env.REDIS_SENTINEL_PORT || 26379;

const REDIS_MASTER_SET_NAME = process.env.REDIS_MASTER_SET_NAME;
if (!REDIS_MASTER_SET_NAME) {
    throw new Error("REDIS_MASTER_SET_NAME is required");
}

const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
if (!REDIS_PASSWORD) {
    throw new Error("REDIS_PASSWORD is required");
}

const REDIS_KEY_PREFIX = process.env.REDIS_KEY_PREFIX || "";

const redis = new Redis({
    sentinels: [{ host: REDIS_SENTINEL_HOST, port: REDIS_SENTINEL_PORT }],
    name: REDIS_MASTER_SET_NAME,
    password: REDIS_PASSWORD,
    sentinelPassword: REDIS_PASSWORD,
    keyPrefix: REDIS_KEY_PREFIX,
    commandTimeout: 100,
    socketTimeout: 1000,
    enableOfflineQueue: false,
});

const fallbackCache = new LRUCache({
    maxSize: 50*1024*1024, // 50MB
    ttl: 60 * 60 * 1000, // 1 hour
    ttlAutopurge: true
})

export default class CacheHandler {
    constructor(options) {
        this.options = options;
    }

    async get(key) {
        if (redis.status === "ready") {
            try {
                console.log("CacheHandler.get redis", key);
                return JSON.parse(await redis.get(key));
            } catch (e) {
                console.error("CacheHandler.get error", e);
            }
        }
        console.log("CacheHandler.get fallbackCache", key);
        //fallback to in-memory cache
        return fallbackCache.get(key);
    }

    async set(key, value, ctx) {
        const data = {
            value,
            lastModified: Date.now(),
        };
        const stringData = JSON.stringify(data);
        if (redis.status === "ready") {
            try {
                console.log("CacheHandler.set redis", key);
                return await redis.set(key, stringData, "EX", 60 * 60); // 1 hour
            } catch (e) {
                console.error("CacheHandler.set error", e);
            }
        }
        console.log("CacheHandler.set fallbackCache", key);
        return fallbackCache.set(key, data, { size: stringData.length });
    }

    async revalidateTag(tag) {
        console.log("CacheHandler.revalidateTag", tag);
        throw new Error("unsupported");
    }
}