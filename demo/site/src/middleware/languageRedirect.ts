import { getHostByHeaders, getSiteConfigForHost } from "@src/util/siteConfig";
import { NextRequest, NextResponse } from "next/server";

import { CustomMiddleware } from "./chain";

export function withLanguageRedirectMiddleware(middleware: CustomMiddleware) {
    return async (request: NextRequest) => {
        const headers = request.headers;
        const host = getHostByHeaders(headers);
        const siteConfig = await getSiteConfigForHost(host);

        const language = request.nextUrl.pathname.split("/")[1];
        if (siteConfig && !siteConfig.scope.languages.includes(language)) {
            return NextResponse.redirect(`${siteConfig.url}/en`);
        }

        return middleware(request);
    };
}
