import { getHostByHeaders, getSiteConfigForHost, getSiteConfigs } from "@src/util/siteConfig";
import { NextRequest, NextResponse } from "next/server";

import { CustomMiddleware } from "./chain";

export function withRedirectMiddleware(middleware: CustomMiddleware) {
    return async (request: NextRequest) => {
        const headers = request.headers;
        const host = getHostByHeaders(headers);
        const siteConfig = await getSiteConfigForHost(host);

        // Redirect to Admin
        if (request.nextUrl.pathname === "/admin" && process.env.ADMIN_URL) {
            return NextResponse.redirect(new URL(process.env.ADMIN_URL));
        }

        // Redirect to Main Host
        if (!siteConfig) {
            // On the preview domain the site-config should be set via previewParams. If not, show a user facing error (avoid triggering a server error)
            if (host === process.env.PREVIEW_DOMAIN) {
                return NextResponse.json({ error: "Preview has to be called from within Comet Web preview" }, { status: 404 });
            }

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
