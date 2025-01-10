import { getHostByHeaders, getSiteConfigForHost } from "@src/util/siteConfig";
import { NextRequest, NextResponse } from "next/server";

import { CustomMiddleware } from "./chain";

export function withDomainRewriteMiddleware(middleware: CustomMiddleware) {
    return async (request: NextRequest) => {
        const headers = request.headers;
        const host = getHostByHeaders(headers);
        const siteConfig = await getSiteConfigForHost(host);
        if (!siteConfig) {
            throw new Error(`Cannot get siteConfig for host ${host}`);
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
    };
}
