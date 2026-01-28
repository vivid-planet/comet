import { type ExternalLinkBlockData, type InternalLinkBlockData, type RedirectsLinkBlockData } from "@src/blocks.generated";
import { type GQLPageTreeNodeScope } from "@src/graphql.generated";

import { createSitePath } from "./createSitePath";

export function getRedirectTargetUrl(block: RedirectsLinkBlockData["block"], host: string): string | undefined {
    if (!block) return undefined;
    switch (block.type) {
        case "internal": {
            const internalLink = block.props as InternalLinkBlockData;
            if (internalLink.targetPage) {
                let destination = createSitePath({
                    path: internalLink.targetPage.path,
                    scope: internalLink.targetPage.scope as Pick<GQLPageTreeNodeScope, "language">,
                });
                if (destination && destination.startsWith("/")) {
                    destination = `http://${host}${destination}`;
                }
                return destination;
            }
            break;
        }
        case "external":
            return (block.props as ExternalLinkBlockData).targetUrl;
    }
    return undefined;
}
