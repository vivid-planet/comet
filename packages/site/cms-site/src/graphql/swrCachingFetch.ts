const fetchCache: Record<string, { timestamp: number; ttl: number; swrTime: number; size: number; response: Response; updating?: true }> = {};

const defaultSwrTime = 60 * 5; //5 minutes
const defaultTtl = 60 * 5; //30 minutes
const maxCacheSize = 1024 * 1024 * 100; //100MB
const stats = {
    uncachable: 0,
    hit: 0,
    miss: 0,
    refresh: 0,
    timeout: 0,
};

interface SwrOptions {
    ttl?: number; //no cache if <= 0
    swrTime?: number; //no swr if <= 0
}

//cleanup cache every 5 minutes
// 1. remove all expired entries
// 2. if cache is too large, remove oldest entries
let cleanupStarted = false;
function avtivateCleanup() {
    if (cleanupStarted) return;
    cleanupStarted = true;

    setInterval(() => {
        let totalSize = 0;
        const now = new Date().getTime() / 1000;
        for (const key in fetchCache) {
            if (fetchCache[key].timestamp + fetchCache[key].ttl < now) {
                stats.timeout++;
                delete fetchCache[key];
            } else {
                totalSize += fetchCache[key].size;
            }
        }
        while (totalSize > maxCacheSize) {
            let oldestKey = "";
            let oldestTimestamp = now;
            for (const key in fetchCache) {
                if (fetchCache[key].timestamp < oldestTimestamp) {
                    oldestKey = key;
                    oldestTimestamp = fetchCache[key].timestamp;
                }
            }
            totalSize -= fetchCache[oldestKey].size;
            delete fetchCache[oldestKey];
        }
        // eslint-disable-next-line no-console
        console.log("swr fetch cache: ", Object.keys(fetchCache).length, "entries", `${Math.round(totalSize / 1024 / 1024)}MB`, stats);
    }, 1000 * 60 * 5);
}

export async function inMemorySwrCachingFetch(input: RequestInfo | URL, init?: RequestInit & SwrOptions): Promise<Response> {
    let cacheKey: string | undefined;
    if (init?.method?.toUpperCase() === "GET") {
        //cache all get requests
        cacheKey = input.toString();
    } else if (init?.body) {
        const body = JSON.parse(init.body.toString());
        if (body.query && body.variables) {
            //looks like a gql query, cache any method
            cacheKey = `${input.toString()}#${init.body.toString()}`;
        }
    }

    const ttl = init?.ttl ?? defaultTtl;
    const swrTime = init?.swrTime ?? defaultSwrTime;
    if (!cacheKey || ttl <= 0) {
        //uncachable, fetch live
        stats.uncachable++;
        return fetch(input, init);
    }

    const cachedResponse = fetchCache[cacheKey];
    if (cachedResponse) {
        if (ttl > 0 && new Date().getTime() / 1000 - cachedResponse.timestamp < cachedResponse.ttl) {
            if (new Date().getTime() / 1000 - cachedResponse.timestamp > cachedResponse.swrTime && !cachedResponse.updating) {
                //update cache in background
                cachedResponse.updating = true;
                stats.refresh++;
                fetch(input, init).then((response) => {
                    fetchCache[cacheKey as string] = {
                        timestamp: new Date().getTime() / 1000,
                        ttl,
                        swrTime,
                        size: response.headers.get("content-length") ? parseInt(response.headers.get("content-length") as string) : 5120, //random default of 5kb
                        response, //no clone, we don't return the response
                    };
                });
            }
            stats.hit++;
            return cachedResponse.response.clone();
        }
    }

    //fetch in foreground (still async)
    stats.miss++;
    const fetchPromise = fetch(input, init);
    const response = await fetchPromise;
    fetchCache[cacheKey] = {
        timestamp: new Date().getTime() / 1000,
        ttl,
        swrTime,
        size: response.headers.get("content-length") ? parseInt(response.headers.get("content-length") as string) : 5120, //random default of 5kb
        response: response.clone(),
    };
    avtivateCleanup(); //activate cleanup on first cache entry
    return fetchPromise;
}
