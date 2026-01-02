import { createOneOfBlock, ExternalLinkBlock } from "@comet/cms-api";

export const EmailCampaignLinkBlock = createOneOfBlock({ supportedBlocks: { external: ExternalLinkBlock }, allowEmpty: true }, "EmailCampaignLink");
