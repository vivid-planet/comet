import { createLinkBlock, ExternalLinkBlock, InternalLinkBlock } from "@comet/cms-admin";
import { NewsLinkBlock } from "@src/news/blocks/NewsLinkBlock";

export const LinkBlock = createLinkBlock({
    supportedBlocks: { internal: InternalLinkBlock, external: ExternalLinkBlock, news: NewsLinkBlock },
});
