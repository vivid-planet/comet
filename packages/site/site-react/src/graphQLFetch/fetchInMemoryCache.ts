const cache: Record<string, Response> = {};

type Fetch = typeof fetch;

export function createFetchInMemoryCache(fetch: Fetch): Fetch {
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
                    if ((body.query || body.extensions?.persistedQuery) && body.variables) {
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

        const cachedResponse = cache[cacheKey];
        if (cachedResponse) {
            return cachedResponse.clone();
        } else {
            const fetchPromise = fetch(input, init);
            const response = await fetchPromise;
            cache[cacheKey] = response.clone();
            return fetchPromise;
        }
    };
}
