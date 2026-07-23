import { createLinkBlock, ExternalLinkBlock, PhoneLinkBlock } from "@comet/cms-admin";

export const MailLinkBlock = createLinkBlock({
    name: "MailLink",
    supportedBlocks: {
        external: ExternalLinkBlock,
        phone: PhoneLinkBlock,
    },
});
