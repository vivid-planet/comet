import { AsyncLocalStorage } from "node:async_hooks";

import type { VisibilityParam } from "@src/middleware/domainRewrite";
import { parse } from "hono/utils/cookie";

type RequestContext = {
    /** The request as sent by the browser, before any middleware rewrites */
    request: Request;
    isRscRequest: boolean;
    visibility: VisibilityParam;
};

const requestContextStorage = new AsyncLocalStorage<RequestContext>();

export function runWithRequestContext<T>(context: Omit<RequestContext, "visibility">, callback: () => T): T {
    return requestContextStorage.run({ ...context, visibility: "default" }, callback);
}

function getRequestContext() {
    const context = requestContextStorage.getStore();
    if (!context) {
        throw new Error("Request context is only available while handling a request");
    }
    return context;
}

export function getRequest() {
    return getRequestContext().request;
}

export function isRscRequest() {
    return getRequestContext().isRscRequest;
}

export function getCookie(name: string): string | undefined {
    return parse(getRequest().headers.get("cookie") ?? "", name)[name];
}

export function setVisibilityParam(visibility: VisibilityParam) {
    getRequestContext().visibility = visibility;
}

// Falls back to "default" outside of the request context, e.g. in the SSR environment, which has its own module instance
export function getVisibilityParam(): VisibilityParam {
    return requestContextStorage.getStore()?.visibility ?? "default";
}
