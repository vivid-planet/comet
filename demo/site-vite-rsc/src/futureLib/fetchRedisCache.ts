import { type Redis } from "ioredis";
import { type LRUCache } from "lru-cache";

type Fetch = typeof fetch;

export function createFetchRedisCache(
    fetch: Fetch,
    cache: { redis: Redis; fallbackCache: LRUCache<string, any>; ttl: number; revalidate: number },
): Fetch {
    let isFallbackInUse = false;
    return async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
        let cacheKey: string | undefined;
        if (init?.cache === "no-store") {
            //don't cache no-store requests
        } else if (init?.method?.toUpperCase() === "GET") {
            //cache all get requests
            cacheKey = input.toString();
        } else if (init?.body) {
            const bodyString = init.body.toString();
            if (bodyString.startsWith("{")) {
                try {
                    const body = JSON.parse(init.body.toString());
                    if (body.query && body.variables) {
                        //looks like a gql query, cache any method
                        cacheKey = `${input.toString()}#${init.body.toString()}`;
                    }
                } catch {
                    //not a valid json
                }
            }
        }
        if (!cacheKey) {
            return fetch(input, init);
        }

        async function get(key: string) {
            if (cache.redis.status === "ready") {
                try {
                    const redisResponse = await cache.redis.get(key);
                    if (isFallbackInUse) {
                        isFallbackInUse = false;
                        console.info(`${new Date().toISOString()} Switching back to redis cache`);
                    }
                    if (!redisResponse) {
                        return null;
                    }
                    return JSON.parse(redisResponse);
                } catch (e) {
                    console.error("CacheHandler.get error", e);
                }
            }

            // fallback to in-memory cache
            if (!isFallbackInUse) {
                console.warn(`${new Date().toISOString()} Switching to fallback in-memory cache`);
                isFallbackInUse = true;
            }

            return cache.fallbackCache.get(key) ?? null;
        }

        async function set(key: string, value: any): Promise<void> {
            const stringData = JSON.stringify(value);

            if (cache.redis.status === "ready") {
                try {
                    await cache.redis.set(key, stringData, "EX", cache.ttl);
                } catch (e) {
                    console.error("CacheHandler.set error", e);
                }
                return;
            }
            cache.fallbackCache.set(key, value, { size: stringData.length, ttl: cache.ttl * 1000 });
        }

        // TODO query-de-duplication?
        const cachedResponse = await get(cacheKey);
        if (cachedResponse) {
            const cacheAge = Date.now() - cachedResponse.lastModified;
            if (cacheAge > cache.revalidate * 1000) {
                // revalidate the cache, return stale data
                //console.log("REVALIDATE", cacheAge / 1000, "s old");
                async function revalidate(cacheKey: string) {
                    const fetchPromise = fetch(input, init);
                    const response = await fetchPromise;
                    const serializedResponse = await serializeResponse(response); // no clone needed, response is not used other than for set
                    if (serializedResponse) {
                        set(cacheKey, serializedResponse);
                    }
                }
                revalidate(cacheKey); // don't await
            } else {
                //console.log("HIT", cacheAge / 1000, "s old");
            }
            return deserializeResponse(cachedResponse);
        } else {
            //console.log("MISS")
            const fetchPromise = fetch(input, init);
            const response = await fetchPromise;
            const serializedResponse = await serializeResponse(response.clone());
            if (serializedResponse) {
                set(cacheKey, serializedResponse);
            }
            return response;
        }
    };
}

// returns false if response must not be cached
async function serializeResponse(response: Response) {
    if (!response.ok) {
        return false;
    }
    const headers: Record<string, string> = {};
    for (const [key, value] of response.headers.entries()) {
        headers[key] = value;
    }

    const body = await response.text();
    if (response.headers.get("content-type")?.includes("application/json")) {
        const json = JSON.parse(body);
        if (json?.errors) {
            // Must not cache GraphQL errors
            return false;
        }
    }

    return {
        lastModified: Date.now(),
        status: response.status,
        statusText: response.statusText,
        headers,
        body,
    };
}

function deserializeResponse(data: any) {
    const { body, status, statusText, headers } = data;
    return new Response(body, {
        status,
        statusText,
        headers,
    });
}
