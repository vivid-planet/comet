import { createLinkBlock, ExternalLinkBlock } from "@comet/cms-admin";

export const EmailCampaignLinkBlock = createLinkBlock({
    supportedBlocks: {
        external: ExternalLinkBlock,
    },
});
