import { createRedirectsLinkBlock, createRedirectsPage } from "@comet/cms-admin";
import { NewsLinkBlock } from "@src/news/blocks/NewsLinkBlock";

const customTargets = {
    news: NewsLinkBlock,
};
export const RedirectsLinkBlock = createRedirectsLinkBlock(customTargets);
// TODO: instead of passing customTargets here, we should use the createRedirectsLinkBlock function to create a custom link block for the redirects. Needs a rework in the library before this is possible.
export const RedirectsPage = createRedirectsPage({ customTargets, scopeParts: ["domain"] });
