import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { domain } from "./config";
import { getPredefinedPageRedirect, getPredefinedPageRewrite } from "./middleware/predefinedPages";
import { createRedirects } from "./middleware/redirects";

export async function middleware(request: NextRequest) {
    const { pathname } = new URL(request.url);

    const scope = { domain };

    const redirects = await createRedirects(scope);

    const redirect = redirects.get(pathname);
    if (redirect) {
        const destination: string = redirect.destination;
        return NextResponse.redirect(new URL(destination, request.url), redirect.permanent ? 308 : 307);
    }

    const predefinedPageRedirect = await getPredefinedPageRedirect(scope, pathname);

    if (predefinedPageRedirect) {
        return NextResponse.redirect(new URL(predefinedPageRedirect, request.url), 307);
    }

    const predefinedPageRewrite = await getPredefinedPageRewrite(scope, pathname);

    if (predefinedPageRewrite) {
        return NextResponse.rewrite(new URL(predefinedPageRewrite, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, favicon.svg, favicon.png
         * - manifest.json
         */
        "/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|favicon.png|manifest.json).*)",
    ],
    // TODO find a better solution for this (https://nextjs.org/docs/messages/edge-dynamic-code-evaluation)
    unstable_allowDynamic: [
        "/node_modules/graphql/**",
        /*
         * cache-manager uses lodash.clonedeep which uses dynamic code evaluation.
         * See https://github.com/lodash/lodash/issues/5525.
         */
        "**/node_modules/.pnpm/**/lodash.clonedeep/**",
    ],
};
