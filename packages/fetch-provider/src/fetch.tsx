import * as React from "react";

interface ICreateFetchOptions {
    baseUrl?: string; // pepends a baseUrl to all requests starting with /
    interceptHeaders?: (headers: Headers) => Promise<void>; // allows modifying headers for all requests (can be async)
}

const isUrlAbsolute = (url: string) => url.indexOf("://") > 0 || url.indexOf("//") === 0;

export function createFetch(options: ICreateFetchOptions) {
    async function appFetch(input: RequestInfo, init?: RequestInit) {
        init = init || {};
        init.headers = init.headers ? new Headers(init.headers) : new Headers();
        if (options.interceptHeaders) await options.interceptHeaders(init.headers);

        // make sure we deal with a Request object even if we got a URL string
        const req = input instanceof Request ? input : new Request(input);

        let modifiedUrl = req.url;
        if (options.baseUrl && !isUrlAbsolute(modifiedUrl)) {
            modifiedUrl = options.baseUrl + modifiedUrl;
        }
        const modifiedRequest = new Request(modifiedUrl, req);
        return fetch(modifiedRequest, init);
    }
    return appFetch;
}

type fetchType = typeof window.fetch;
export const FetchContext = React.createContext<fetchType>(window.fetch);
export const FetchProvider = FetchContext.Provider;

export function useFetch() {
    return React.useContext(FetchContext);
}
