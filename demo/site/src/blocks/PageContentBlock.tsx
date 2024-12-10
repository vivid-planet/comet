"use client";
import { BlocksBlock, DamVideoBlock, PropsWithData, SupportedBlocks } from "@comet/cms-site";
import { PageContentBlockData } from "@src/blocks.generated";
import { CookieSafeYouTubeVideoBlock } from "@src/blocks/CookieSafeYouTubeVideoBlock";
import { LayoutBlock } from "@src/blocks/LayoutBlock";
import { ImageLinkBlock } from "@src/documents/pages/blocks/ImageLinkBlock";
import { TeaserBlock } from "@src/documents/pages/blocks/TeaserBlock";
import { NewsDetailBlock } from "@src/news/blocks/NewsDetailBlock";
import { NewsListBlock } from "@src/news/blocks/NewsListBlock";

import { AnchorBlock } from "./AnchorBlock";
import { ColumnsBlock } from "./ColumnsBlock";
import { DamImageBlock } from "./DamImageBlock";
import { FullWidthImageBlock } from "./FullWidthImageBlock";
import { HeadingBlock } from "./HeadingBlock";
import { LinkListBlock } from "./LinkListBlock";
import { MediaBlock } from "./MediaBlock";
import { RichTextBlock } from "./RichTextBlock";
import SpaceBlock from "./SpaceBlock";
import { TextImageBlock } from "./TextImageBlock";

const supportedBlocks: SupportedBlocks = {
    space: (props) => <SpaceBlock data={props} />,
    richText: (props) => <RichTextBlock data={props} />,
    headline: (props) => <HeadingBlock data={props} />,
    image: (props) => <DamImageBlock data={props} aspectRatio="inherit" />,
    textImage: (props) => <TextImageBlock data={props} />,
    damVideo: (props) => <DamVideoBlock data={props} />,
    youTubeVideo: (props) => <CookieSafeYouTubeVideoBlock data={props} />,
    linkList: (props) => <LinkListBlock data={props} />,
    fullWidthImage: (props) => <FullWidthImageBlock data={props} />,
    columns: (props) => <ColumnsBlock data={props} />,
    anchor: (props) => <AnchorBlock data={props} />,
    media: (props) => <MediaBlock data={props} aspectRatio="inherit" />,
    teaser: (props) => <TeaserBlock data={props} />,
    newsDetail: (props) => <NewsDetailBlock data={props} />,
    imageLink: (props) => <ImageLinkBlock data={props} />,
    newsList: (props) => <NewsListBlock data={props} />,
    layout: (props) => <LayoutBlock data={props} />,
};

export const PageContentBlock = ({ data }: PropsWithData<PageContentBlockData>) => {
    return <BlocksBlock data={data} supportedBlocks={supportedBlocks} />;
};
