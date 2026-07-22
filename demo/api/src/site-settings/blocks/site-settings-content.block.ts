import {
    BlockData,
    BlockDataInterface,
    BlockInput,
    blockInputToData,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    ExtractBlockInput,
} from "@comet/cms-api";

import { OrganizationBlock } from "./organization.block";

class SiteSettingsContentBlockData extends BlockData {
    @ChildBlock(OrganizationBlock)
    organization: BlockDataInterface;
}

class SiteSettingsContentBlockInput extends BlockInput {
    @ChildBlockInput(OrganizationBlock)
    organization: ExtractBlockInput<typeof OrganizationBlock>;

    transformToBlockData(): SiteSettingsContentBlockData {
        return blockInputToData(SiteSettingsContentBlockData, this);
    }
}

export const SiteSettingsContentBlock = createBlock(SiteSettingsContentBlockData, SiteSettingsContentBlockInput, {
    name: "SiteSettingsContent",
});
