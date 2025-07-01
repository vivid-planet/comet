import { createRedirectsLinkBlock, createRedirectsPage } from "@comet/cms-admin";
import { NewsLinkBlock } from "@src/news/blocks/NewsLinkBlock";

export const RedirectsLinkBlock = createRedirectsLinkBlock({
    news: NewsLinkBlock,
});

export const RedirectsPage = createRedirectsPage({ link: RedirectsLinkBlock, scopeParts: ["domain"] });
