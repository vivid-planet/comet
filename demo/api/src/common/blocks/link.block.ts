import { createLinkBlock, DamFileDownloadLinkBlock, EmailLinkBlock, ExternalLinkBlock, InternalLinkBlock, PhoneLinkBlock } from "@comet/cms-api";
import { NewsLinkBlock } from "@src/news/blocks/news-link.block";

export const LinkBlock = createLinkBlock({
    supportedBlocks: {
        damFileDownload: DamFileDownloadLinkBlock,
        email: EmailLinkBlock,
        external: ExternalLinkBlock,
        internal: InternalLinkBlock,
        news: NewsLinkBlock,
        phone: PhoneLinkBlock,
    },
});
