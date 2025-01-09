import { createBlocksBlock } from "@comet/blocks-admin";
import { DamImageBlock } from "@comet/cms-admin";
import { AccordionBlock } from "@src/common/blocks/AccordionBlock";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import { StandaloneHeadingBlock } from "@src/common/blocks/StandaloneHeadingBlock";
import { StandaloneMediaBlock } from "@src/common/blocks/StandaloneMediaBlock";
import { userGroupAdditionalItemFields } from "@src/userGroups/userGroupAdditionalItemFields";
import { UserGroupChip } from "@src/userGroups/UserGroupChip";
import { UserGroupContextMenuItem } from "@src/userGroups/UserGroupContextMenuItem";

import { TeaserBlock } from "./TeaserBlock";

export const PageContentBlock = createBlocksBlock({
    name: "PageContent",
    supportedBlocks: {
        accordion: AccordionBlock,
        teaser: TeaserBlock,
        richtext: RichTextBlock,
        heading: StandaloneHeadingBlock,
        media: StandaloneMediaBlock,
        image: DamImageBlock,
    },
    additionalItemFields: {
        ...userGroupAdditionalItemFields,
    },
    AdditionalItemContextMenuItems: ({ item, onChange, onMenuClose }) => {
        return <UserGroupContextMenuItem item={item} onChange={onChange} onMenuClose={onMenuClose} />;
    },
    AdditionalItemContent: ({ item }) => {
        return <UserGroupChip item={item} />;
    },
});
