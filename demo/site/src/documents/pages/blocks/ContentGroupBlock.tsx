import { BlocksBlock, type PropsWithData, type SupportedBlocks, withPreview } from "@comet/site-nextjs";
import { type ContentGroupBlockData, type ContentGroupContentBlockData } from "@src/blocks.generated";
import { PageContentAccordionBlock } from "@src/common/blocks/AccordionBlock";
import { AnchorBlock } from "@src/common/blocks/AnchorBlock";
import { PageContentMediaGalleryBlock } from "@src/common/blocks/MediaGalleryBlock";
import { PageContentRichTextBlock } from "@src/common/blocks/RichTextBlock";
import { SpaceBlock } from "@src/common/blocks/SpaceBlock";
import { PageContentStandaloneCallToActionListBlock } from "@src/common/blocks/StandaloneCallToActionListBlock";
import { PageContentStandaloneHeadingBlock } from "@src/common/blocks/StandaloneHeadingBlock";
import { StandaloneMediaBlock } from "@src/common/blocks/StandaloneMediaBlock";
import { ColumnsBlock } from "@src/documents/pages/blocks/ColumnsBlock";
import { KeyFactsBlock } from "@src/documents/pages/blocks/KeyFactsBlock";
import { TeaserBlock } from "@src/documents/pages/blocks/TeaserBlock";
import { PageLayout } from "@src/layout/PageLayout";

import styles from "./ContentGroupBlock.module.scss";

const supportedBlocks: SupportedBlocks = {
    accordion: (props) => <PageContentAccordionBlock data={props} />,
    anchor: (props) => <AnchorBlock data={props} />,
    space: (props) => <SpaceBlock data={props} />,
    teaser: (props) => <TeaserBlock data={props} />,
    richtext: (props) => <PageContentRichTextBlock data={props} disableLastBottomSpacing />,
    heading: (props) => <PageContentStandaloneHeadingBlock data={props} />,
    columns: (props) => <ColumnsBlock data={props} />,
    callToActionList: (props) => <PageContentStandaloneCallToActionListBlock data={props} />,
    keyFacts: (props) => <KeyFactsBlock data={props} />,
    media: (props) => <StandaloneMediaBlock data={props} />,
    mediaGallery: (props) => <PageContentMediaGalleryBlock data={props} />,
};

const ContentGroupContentBlock = withPreview(
    ({ data }: PropsWithData<ContentGroupContentBlockData>) => {
        return <BlocksBlock data={data} supportedBlocks={supportedBlocks} />;
    },
    { label: "ContentGroupContent" },
);

export const ContentGroupBlock = withPreview(
    ({ data: { content, backgroundColor } }: PropsWithData<ContentGroupBlockData>) => (
        <PageLayout className={backgroundColor !== "default" ? styles[backgroundColor] : undefined}>
            <ContentGroupContentBlock data={content} />
        </PageLayout>
    ),
    { label: "ContentGroup" },
);
