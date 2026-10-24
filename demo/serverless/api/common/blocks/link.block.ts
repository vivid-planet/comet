import { createLinkBlock, EmailLinkBlock, ExternalLinkBlock, PhoneLinkBlock } from "@dextinity/serverless-blocks/server";
import { DamFileDownloadLinkBlock } from "@dextinity/serverless-dam/server";
import { InternalLinkBlock } from "@dextinity/serverless-page-tree/server";

export const LinkBlock = createLinkBlock({
    supportedBlocks: {
        internal: InternalLinkBlock,
        external: ExternalLinkBlock,
        damFileDownload: DamFileDownloadLinkBlock,
        email: EmailLinkBlock,
        phone: PhoneLinkBlock,
    },
});
