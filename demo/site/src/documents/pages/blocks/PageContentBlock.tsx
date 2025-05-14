"use client";
import { BlocksBlock, PropsWithData, SupportedBlocks } from "@comet/site-nextjs";
import { PageContentBlockData } from "@src/blocks.generated";
import { PageContentAccordionBlock } from "@src/common/blocks/AccordionBlock";
import { AnchorBlock } from "@src/common/blocks/AnchorBlock";
import { DamImageBlock } from "@src/common/blocks/DamImageBlock";
import { LayoutBlock } from "@src/common/blocks/LayoutBlock";
import { PageContentMediaGalleryBlock } from "@src/common/blocks/MediaGalleryBlock";
import { PageContentRichTextBlock } from "@src/common/blocks/RichTextBlock";
import { SpaceBlock } from "@src/common/blocks/SpaceBlock";
import { PageContentStandaloneCallToActionListBlock } from "@src/common/blocks/StandaloneCallToActionListBlock";
import { PageContentStandaloneHeadingBlock } from "@src/common/blocks/StandaloneHeadingBlock";
import { StandaloneMediaBlock } from "@src/common/blocks/StandaloneMediaBlock";
import { TextImageBlock } from "@src/common/blocks/TextImageBlock";
import { BillboardTeaserBlock } from "@src/documents/pages/blocks/BillboardTeaserBlock";
import { ColumnsBlock } from "@src/documents/pages/blocks/ColumnsBlock";
import { ContentGroupBlock } from "@src/documents/pages/blocks/ContentGroupBlock";
import { FullWidthImageBlock } from "@src/documents/pages/blocks/FullWidthImageBlock";
import { KeyFactsBlock } from "@src/documents/pages/blocks/KeyFactsBlock";
import { SliderBlock } from "@src/documents/pages/blocks/SliderBlock";
import { TeaserBlock } from "@src/documents/pages/blocks/TeaserBlock";
import { NewsDetailBlock } from "@src/news/blocks/NewsDetailBlock";
import { NewsListBlock } from "@src/news/blocks/NewsListBlock";

const supportedBlocks: SupportedBlocks = {
    accordion: (props) => <PageContentAccordionBlock data={props} />,
    anchor: (props) => <AnchorBlock data={props} />,
    billboardTeaser: (props) => <BillboardTeaserBlock data={props} />,
    space: (props) => <SpaceBlock data={props} />,
    teaser: (props) => <TeaserBlock data={props} />,
    richtext: (props) => <PageContentRichTextBlock data={props} disableLastBottomSpacing />,
    heading: (props) => <PageContentStandaloneHeadingBlock data={props} />,
    columns: (props) => <ColumnsBlock data={props} />,
    callToActionList: (props) => <PageContentStandaloneCallToActionListBlock data={props} />,
    keyFacts: (props) => <KeyFactsBlock data={props} />,
    media: (props) => <StandaloneMediaBlock data={props} />,
    contentGroup: (props) => <ContentGroupBlock data={props} />,
    mediaGallery: (props) => <PageContentMediaGalleryBlock data={props} />,
    slider: (props) => <SliderBlock data={props} />,

    newsList: (props) => <NewsListBlock data={props} />,
    newsDetail: (props) => <NewsDetailBlock data={props} />,
    image: (props) => <DamImageBlock data={props} aspectRatio="inherit" />,
    layout: (props) => <LayoutBlock data={props} />,
    textImage: (props) => <TextImageBlock data={props} />,
    fullWidthImage: (props) => <FullWidthImageBlock data={props} />,
};

export const PageContentBlock = ({ data }: PropsWithData<PageContentBlockData>) => {
    return <BlocksBlock data={data} supportedBlocks={supportedBlocks} />;
};
