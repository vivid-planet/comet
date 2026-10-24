import { createLinkBlock, EmailLinkBlock, ExternalLinkBlock, PhoneLinkBlock } from "@dextinity/cms-admin";
import { DamFileDownloadLinkBlock } from "@dextinity/serverless-dam/client";
import { InternalLinkBlock } from "@dextinity/serverless-page-tree/client";
import { defineMessage } from "react-intl";

export const LinkBlock = createLinkBlock({
    supportedBlocks: {
        internal: InternalLinkBlock,
        external: ExternalLinkBlock,
        damFileDownload: DamFileDownloadLinkBlock,
        email: EmailLinkBlock,
        phone: PhoneLinkBlock,
    },
    tags: [
        defineMessage({ id: "linkBlock.tag.link", defaultMessage: "link" }),
        defineMessage({ id: "linkBlock.tag.button", defaultMessage: "Button" }),
        "coffee",
    ],
});
