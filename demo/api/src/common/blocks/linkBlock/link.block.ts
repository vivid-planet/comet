import { ExternalLinkBlock } from "@comet/blocks-api";
import { createLinkBlock, InternalLinkBlock } from "@comet/cms-api";
import { NewsLinkBlock } from "@src/news/blocks/news-link.block";

export const LinkBlock = createLinkBlock({ supportedBlocks: { internal: InternalLinkBlock, external: ExternalLinkBlock, news: NewsLinkBlock } });
