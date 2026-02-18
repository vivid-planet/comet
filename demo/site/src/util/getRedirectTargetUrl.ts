import { type ExternalLinkBlockData, type InternalLinkBlockData, type NewsLinkBlockData, type RedirectsLinkBlockData } from "@src/blocks.generated";
import { type GQLPageTreeNodeScope } from "@src/graphql.generated";

import { createSitePath } from "./createSitePath";

export function getRedirectTargetUrl(block: RedirectsLinkBlockData["block"], host = ""): string | undefined {
    if (!block) {
        return undefined;
    }
    switch (block.type) {
        case "internal": {
            const internalLink = block.props as InternalLinkBlockData;
            if (internalLink.targetPage) {
                let destination = createSitePath({
                    path: internalLink.targetPage.path,
                    scope: internalLink.targetPage.scope as GQLPageTreeNodeScope,
                });
                destination = `${host}${destination}`;

                return destination;
            }
            break;
        }
        case "external":
            return (block.props as ExternalLinkBlockData).targetUrl;
        case "news": {
            const newsLink = block.props as NewsLinkBlockData;
            if (newsLink.news) {
                const destination = createSitePath({
                    path: `/news/${newsLink.news.slug}`,
                    scope: newsLink.news.scope,
                });
                return `${host}${destination}`;
            }
            break;
        }
    }
    return undefined;
}
