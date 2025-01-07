import { getHostByHeaders, getSiteConfigForHost, getSiteConfigs } from "@src/util/siteConfig";
import { NextRequest, NextResponse } from "next/server";

import { CustomMiddleware } from "./chain";

export function withRedirectToMainHostMiddleware(middleware: CustomMiddleware) {
    return async (request: NextRequest) => {
        const headers = request.headers;
        const host = getHostByHeaders(headers);
        const siteConfig = await getSiteConfigForHost(host);

        if (!siteConfig) {
            // Redirect to Main Host
            const redirectSiteConfig = getSiteConfigs().find(
                (siteConfig) =>
                    siteConfig.domains.additional?.includes(host) ||
                    (siteConfig.domains.pattern && host.match(new RegExp(siteConfig.domains.pattern))),
            );
            if (redirectSiteConfig) {
                return NextResponse.redirect(redirectSiteConfig.url);
            }

            throw new Error(`Cannot get siteConfig for host ${host}`);
        }
        return middleware(request);
    };
}
