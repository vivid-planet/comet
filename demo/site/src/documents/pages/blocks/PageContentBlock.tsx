"use client";
import { BlocksBlock, PropsWithData, SupportedBlocks } from "@comet/cms-site";
import { PageContentBlockData } from "@src/blocks.generated";
import { PageContentAccordionBlock } from "@src/common/blocks/AccordionBlock";
import { DamImageBlock } from "@src/common/blocks/DamImageBlock";
import { PageContentRichTextBlock } from "@src/common/blocks/RichTextBlock";
import { PageContentStandaloneHeadingBlock } from "@src/common/blocks/StandaloneHeadingBlock";
import { StandaloneMediaBlock } from "@src/common/blocks/StandaloneMediaBlock";
import { TeaserBlock } from "@src/documents/pages/blocks/TeaserBlock";

const supportedBlocks: SupportedBlocks = {
    accordion: (props) => <PageContentAccordionBlock data={props} />,
    teaser: (props) => <TeaserBlock data={props} />,
    richtext: (props) => <PageContentRichTextBlock data={props} disableLastBottomSpacing />,
    heading: (props) => <PageContentStandaloneHeadingBlock data={props} />,
    media: (props) => <StandaloneMediaBlock data={props} />,
    image: (props) => <DamImageBlock data={props} aspectRatio="inherit" />,
};

export const PageContentBlock = ({ data }: PropsWithData<PageContentBlockData>) => {
    return <BlocksBlock data={data} supportedBlocks={supportedBlocks} />;
};
