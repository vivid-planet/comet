import { AnchorBlock, createBlocksBlock, DamImageBlock } from "@comet/cms-admin";
import { AccordionBlock } from "@src/common/blocks/AccordionBlock";
import { LayoutBlock } from "@src/common/blocks/LayoutBlock";
import { MediaGalleryBlock } from "@src/common/blocks/MediaGalleryBlock";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import { SpaceBlock } from "@src/common/blocks/SpaceBlock";
import { StandaloneCallToActionListBlock } from "@src/common/blocks/StandaloneCallToActionListBlock";
import { StandaloneHeadingBlock } from "@src/common/blocks/StandaloneHeadingBlock";
import { StandaloneMediaBlock } from "@src/common/blocks/StandaloneMediaBlock";
import { TextImageBlock } from "@src/common/blocks/TextImageBlock";
import { NewsDetailBlock } from "@src/news/blocks/NewsDetailBlock";
import { NewsListBlock } from "@src/news/blocks/NewsListBlock";
import { ProductListBlock } from "@src/products/blocks/ProductListBlock";
import { userGroupAdditionalItemFields } from "@src/userGroups/userGroupAdditionalItemFields";
import { UserGroupChip } from "@src/userGroups/UserGroupChip";
import { UserGroupContextMenuItem } from "@src/userGroups/UserGroupContextMenuItem";

import { BillboardTeaserBlock } from "./BillboardTeaserBlock";
import { ColumnsBlock } from "./ColumnsBlock";
import { ContentGroupBlock } from "./ContentGroupBlock";
import { FullWidthImageBlock } from "./FullWidthImageBlock";
import { KeyFactsBlock } from "./KeyFactsBlock";
import { SliderBlock } from "./SliderBlock";
import { TeaserBlock } from "./TeaserBlock";

export const PageContentBlock = createBlocksBlock({
    name: "PageContent",
    supportedBlocks: {
        accordion: AccordionBlock,
        anchor: AnchorBlock,
        billboardTeaser: BillboardTeaserBlock,
        space: SpaceBlock,
        teaser: TeaserBlock,
        richtext: RichTextBlock,
        heading: StandaloneHeadingBlock,
        columns: ColumnsBlock,
        callToActionList: StandaloneCallToActionListBlock,
        keyFacts: KeyFactsBlock,
        media: StandaloneMediaBlock,
        contentGroup: ContentGroupBlock,
        mediaGallery: MediaGalleryBlock,
        slider: SliderBlock,

        image: DamImageBlock,
        newsDetail: NewsDetailBlock,
        newsList: NewsListBlock,
        layout: LayoutBlock,
        textImage: TextImageBlock,
        fullWidthImage: FullWidthImageBlock,
        productList: ProductListBlock,
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
