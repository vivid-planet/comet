export class NotFoundError extends Error {
    constructor() {
        super("Not found");
    }
}

export class RedirectError extends Error {
    constructor(
        readonly location: string,
        readonly status: 301 | 302 | 307 | 308,
    ) {
        super(`Redirect to ${location}`);
    }
}

/**
 * Renders the not found page with status 404.
 * Only has an effect when thrown while loading a page, i.e. before the page component returns.
 */
export function notFound(): never {
    throw new NotFoundError();
}

/**
 * Responds with a redirect.
 * Only has an effect when thrown while loading a page, i.e. before the page component returns.
 */
export function redirect(location: string, status: RedirectError["status"] = 307): never {
    throw new RedirectError(location, status);
}
