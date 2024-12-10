import { createBlocksBlock } from "@comet/blocks-admin";
import { AnchorBlock, DamImageBlock } from "@comet/cms-admin";
import { AccordionBlock } from "@src/common/blocks/AccordionBlock";
import { LinkListBlock } from "@src/common/blocks/LinkListBlock";
import { MediaGalleryBlock } from "@src/common/blocks/MediaGalleryBlock";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import { SpaceBlock } from "@src/common/blocks/SpaceBlock";
import { StandaloneCallToActionListBlock } from "@src/common/blocks/StandaloneCallToActionListBlock";
import { StandaloneHeadingBlock } from "@src/common/blocks/StandaloneHeadingBlock";
import { StandaloneMediaBlock } from "@src/common/blocks/StandaloneMediaBlock";
import { TextImageBlock } from "@src/common/blocks/TextImageBlock";
import { NewsDetailBlock } from "@src/news/blocks/NewsDetailBlock";
import { NewsListBlock } from "@src/news/blocks/NewsListBlock";

import { BillboardTeaserBlock } from "./BillboardTeaserBlock";
import { ColumnsBlock } from "./ColumnsBlock";
import { ContentGroupBlock } from "./ContentGroupBlock";
import { FullWidthImageBlock } from "./FullWidthImageBlock";
import { ImageLinkBlock } from "./ImageLinkBlock";
import { KeyFactsBlock } from "./KeyFactsBlock";
import { TeaserBlock } from "./TeaserBlock";

export const PageContentBlock = createBlocksBlock({
    name: "PageContent",
    supportedBlocks: {
        accordion: AccordionBlock,
        anchor: AnchorBlock,
        billboardTeaser: BillboardTeaserBlock,
        callToActionList: StandaloneCallToActionListBlock,
        columns: ColumnsBlock,
        contentGroup: ContentGroupBlock,
        fullWidthImage: FullWidthImageBlock,
        heading: StandaloneHeadingBlock,
        image: DamImageBlock,
        imageLink: ImageLinkBlock,
        keyFacts: KeyFactsBlock,
        linkList: LinkListBlock,
        media: StandaloneMediaBlock,
        mediaGallery: MediaGalleryBlock,
        newsDetail: NewsDetailBlock,
        newsList: NewsListBlock,
        richText: RichTextBlock,
        space: SpaceBlock,
        teaser: TeaserBlock,
        textImage: TextImageBlock,
    },
});
