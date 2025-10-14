type Fetch = typeof fetch;

export function createFetchWithDefaults(fetch: Fetch, defaults: RequestInit): Fetch {
    return async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
        return fetch(input, {
            ...defaults,
            ...init,
            headers: {
                ...defaults.headers,
                ...init?.headers,
            },
            next: {
                ...defaults.next,
                ...init?.next,
            },
        });
    };
}
/**
 * Create fetch that applies default next.revalidate time if cache is not set to "no-store", "no-cache", "only-if-cached" or "reload".
 */
export function createFetchWithDefaultNextRevalidate(baseFetch: Fetch, defaultRevalidate: number): Fetch {
    return async function (requestInfo: RequestInfo | URL, requestInit?: RequestInit): Promise<Response> {
        const disallowRevalidate = ["no-store", "no-cache", "only-if-cached", "reload"];
        const requestCache = requestInit?.cache;
        const shouldApplyRevalidate = !requestCache || !disallowRevalidate.includes(requestCache);

        const mergedInit = {
            ...requestInit,
            next: {
                ...requestInit?.next,
                ...(shouldApplyRevalidate && requestInit?.next?.revalidate === undefined ? { revalidate: defaultRevalidate } : {}),
            },
        };

        return baseFetch(requestInfo, mergedInit);
    };
}
