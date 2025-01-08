import { ExternalLinkBlock } from "@comet/blocks-api";
import { createLinkBlock, DamFileDownloadLinkBlock, EmailLinkBlock, InternalLinkBlock, PhoneLinkBlock } from "@comet/cms-api";
import { NewsLinkBlock } from "@src/news/blocks/news-link.block";

export const LinkBlock = createLinkBlock({
    supportedBlocks: {
        internal: InternalLinkBlock,
        external: ExternalLinkBlock,
        damFileDownload: DamFileDownloadLinkBlock,
        email: EmailLinkBlock,
        phone: PhoneLinkBlock,
        news: NewsLinkBlock,
    },
});
