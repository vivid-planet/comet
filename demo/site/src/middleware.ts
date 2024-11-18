import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getPredefinedPageRedirect, getPredefinedPageRewrite } from "./middleware/predefinedPages";
import { getHostByHeaders, getSiteConfigForHost, getSiteConfigs } from "./util/siteConfig";

export async function middleware(request: NextRequest) {
    const headers = request.headers;
    const host = getHostByHeaders(headers);
    const { pathname } = new URL(request.url);

    // Block-Preview
    if (request.nextUrl.pathname.startsWith("/block-preview/")) {
        return NextResponse.next({ request: { headers } });
    }

    const siteConfig = await getSiteConfigForHost(host);
    if (!siteConfig) {
        // Redirect to Main Host
        const redirectSiteConfig = getSiteConfigs().find(
            (siteConfig) =>
                siteConfig.domains.additional?.includes(host) || (siteConfig.domains.pattern && host.match(new RegExp(siteConfig.domains.pattern))),
        );
        if (redirectSiteConfig) {
            return NextResponse.redirect(redirectSiteConfig.url);
        }

        throw new Error(`Cannot get siteConfig for host ${host}`);
    }

    if (pathname.startsWith("/dam/")) {
        return NextResponse.rewrite(new URL(`${process.env.API_URL_INTERNAL}${request.nextUrl.pathname}`));
    }

    if (request.nextUrl.pathname === "/admin" && process.env.ADMIN_URL) {
        return NextResponse.redirect(new URL(process.env.ADMIN_URL));
    }

    const predefinedPageRedirect = await getPredefinedPageRedirect(siteConfig.scope.domain, pathname);
    if (predefinedPageRedirect) {
        return NextResponse.redirect(new URL(predefinedPageRedirect, request.url), 307);
    }

    const predefinedPageRewrite = await getPredefinedPageRewrite(siteConfig.scope.domain, pathname);
    if (predefinedPageRewrite) {
        return NextResponse.rewrite(new URL(predefinedPageRewrite, request.url));
    }

    return NextResponse.rewrite(
        new URL(
            `/${siteConfig.scope.domain}${request.nextUrl.pathname}${
                request.nextUrl.searchParams.toString().length > 0 ? `?${request.nextUrl.searchParams.toString()}` : ""
            }`,
            request.url,
        ),
        { request: { headers } },
    );
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
         * - robots.txt
         */
        "/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|favicon.png|manifest.json|robots.txt).*)",
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
