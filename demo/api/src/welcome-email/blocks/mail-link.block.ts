import { createLinkBlock, ExternalLinkBlock, PhoneLinkBlock } from "@comet/cms-api";

export const MailLinkBlock = createLinkBlock(
    {
        supportedBlocks: {
            external: ExternalLinkBlock,
            phone: PhoneLinkBlock,
        },
    },
    "MailLink",
);
