import { ExternalLinkBlock } from "@comet/blocks-api";
import { createLinkBlock, DamFileDownloadLinkBlock, EmailLinkBlock, InternalLinkBlock, PhoneLinkBlock } from "@comet/cms-api";
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
