import { BlockData, BlockInput, blockInputToData, createBlock } from "@dextinity/cms-api";

class EmailCampaignDividerBlockData extends BlockData {}

class EmailCampaignDividerBlockInput extends BlockInput {
    transformToBlockData(): EmailCampaignDividerBlockData {
        return blockInputToData(EmailCampaignDividerBlockData, this);
    }
}

export const EmailCampaignDividerBlock = createBlock(EmailCampaignDividerBlockData, EmailCampaignDividerBlockInput, "EmailCampaignDivider");
