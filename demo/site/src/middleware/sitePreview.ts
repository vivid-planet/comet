import { getHostByHeaders, getSiteConfigForHost } from "@src/util/siteConfig";
import { type NextRequest, NextResponse } from "next/server";

import { type CustomMiddleware } from "./chain";

export function withSitePreviewMiddleware(middleware: CustomMiddleware) {
    return async (request: NextRequest) => {
        const host = getHostByHeaders(request.headers);
        const siteConfig = await getSiteConfigForHost(host);
        if (!siteConfig && host === process.env.PREVIEW_DOMAIN) {
            return NextResponse.json({ error: "Preview has to be called from within Comet Web preview" }, { status: 404 });
        }
        return middleware(request);
    };
}
