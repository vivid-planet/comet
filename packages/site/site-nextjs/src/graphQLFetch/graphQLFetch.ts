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
