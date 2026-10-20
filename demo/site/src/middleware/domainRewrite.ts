import { router } from "@src/app/router";
import { getHostByHeaders, getSiteConfigForHost } from "@src/util/siteConfig";
import { getPreviewParams } from "@src/util/sitePreview";
import { createMiddleware } from "hono/factory";

import type { MiddlewareEnv } from "./env";

export type VisibilityParam = "default" | "invisiblePages" | "invisibleBlocks";

export const domainRewriteMiddleware = createMiddleware<MiddlewareEnv>(async (c) => {
    const host = getHostByHeaders(c.req.raw.headers);
    const siteConfig = await getSiteConfigForHost(host);
    if (!siteConfig) {
        throw new Error(`Cannot get siteConfig for host ${host}`);
    }

    const preview = await getPreviewParams({ checkBlockPreviewHeader: true });
    let visibilityParam: VisibilityParam = "default";
    if (preview?.previewData) {
        visibilityParam = preview.previewData.includeInvisible ? "invisibleBlocks" : "invisiblePages";
    }

    const url = new URL(c.req.url);
    const pathname = c.get("rewrittenPathname") ?? url.pathname;
    const rewrittenUrl = new URL(`/${visibilityParam}/${siteConfig.scope.domain}${pathname}${url.search}`, url);

    // duplex is required for streaming the request body, but missing in the DOM RequestInit type
    const init = { method: c.req.method, headers: c.req.raw.headers, body: c.req.raw.body, duplex: "half", signal: c.req.raw.signal } as RequestInit;
    return router.fetch(new Request(rewrittenUrl, init));
});
