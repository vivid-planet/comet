import { createBlocksBlock } from "@comet/blocks-admin";
import { AnchorBlock, DamImageBlock, TableBlock } from "@comet/cms-admin";
import { HeadlineBlock } from "@src/common/blocks/HeadlineBlock";
import { LinkListBlock } from "@src/common/blocks/LinkListBlock";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import { SpaceBlock } from "@src/common/blocks/SpaceBlock";
import { TextImageBlock } from "@src/common/blocks/TextImageBlock";
import { NewsDetailBlock } from "@src/news/blocks/NewsDetailBlock";
import { NewsListBlock } from "@src/news/blocks/NewsListBlock";
import { userGroupAdditionalItemFields } from "@src/userGroups/userGroupAdditionalItemFields";
import { UserGroupChip } from "@src/userGroups/UserGroupChip";
import { UserGroupContextMenuItem } from "@src/userGroups/UserGroupContextMenuItem";

import { ColumnsBlock } from "./blocks/ColumnsBlock";
import { FullWidthImageBlock } from "./blocks/FullWidthImageBlock";
import { ImageLinkBlock } from "./blocks/ImageLinkBlock";
import { MediaBlock } from "./blocks/MediaBlock";
import { TeaserBlock } from "./blocks/TeaserBlock";
import { TwoListsBlock } from "./blocks/TwoListsBlock";

export const PageContentBlock = createBlocksBlock({
    name: "PageContent",
    supportedBlocks: {
        space: SpaceBlock,
        richtext: RichTextBlock,
        headline: HeadlineBlock,
        image: DamImageBlock,
        textImage: TextImageBlock,
        linkList: LinkListBlock,
        fullWidthImage: FullWidthImageBlock,
        columns: ColumnsBlock,
        anchor: AnchorBlock,
        twoLists: TwoListsBlock,
        media: MediaBlock,
        teaser: TeaserBlock,
        newsDetail: NewsDetailBlock,
        imageLink: ImageLinkBlock,
        newsList: NewsListBlock,
        table: TableBlock,
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
