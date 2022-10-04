import { createOneOfBlock, ExternalLinkBlock } from "@comet/blocks-api";
import { InternalLinkBlock } from "@comet/cms-api";
import { NewsLinkBlock } from "@src/news/blocks/news-link.block";

const customTargets = {
    news: NewsLinkBlock,
};

export const RedirectsLinkBlock = createOneOfBlock(
    { supportedBlocks: { internal: InternalLinkBlock, external: ExternalLinkBlock, ...customTargets }, allowEmpty: false },
    "RedirectsLink",
);
