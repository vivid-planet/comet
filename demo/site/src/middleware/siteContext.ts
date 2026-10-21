import { siteRouter } from "@src/app/router";
import { setSiteContext, type Visibility } from "@src/framework/requestContext";
import { getHostByHeaders, getSiteConfigForHost } from "@src/util/siteConfig";
import { getPreviewParams } from "@src/util/sitePreview";
import { createMiddleware } from "hono/factory";

import type { MiddlewareEnv } from "./env";

export const siteContextMiddleware = createMiddleware<MiddlewareEnv>(async (c) => {
    const host = getHostByHeaders(c.req.raw.headers);
    const siteConfig = await getSiteConfigForHost(host);
    if (!siteConfig) {
        throw new Error(`Cannot get siteConfig for host ${host}`);
    }

    const preview = await getPreviewParams({ checkBlockPreviewHeader: true });
    let visibility: Visibility = "default";
    if (preview?.previewData) {
        visibility = preview.previewData.includeInvisible ? "invisibleBlocks" : "invisiblePages";
    }

    setSiteContext({ domain: siteConfig.scope.domain, visibility });

    const rewrittenPathname = c.get("rewrittenPathname");
    if (!rewrittenPathname) {
        return siteRouter.fetch(c.req.raw);
    }

    const url = new URL(c.req.url);
    url.pathname = rewrittenPathname;
    // duplex is required for streaming the request body, but missing in the DOM RequestInit type
    const init = { method: c.req.method, headers: c.req.raw.headers, body: c.req.raw.body, duplex: "half", signal: c.req.raw.signal } as RequestInit;
    return siteRouter.fetch(new Request(url, init));
});
