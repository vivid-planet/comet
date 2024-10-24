"use client";
import { BlocksBlock, DamVideoBlock, PropsWithData, SupportedBlocks } from "@comet/cms-site";
import { PageContentBlockData } from "@src/blocks.generated";
import { CookieSafeYouTubeVideoBlock } from "@src/blocks/CookieSafeYouTubeVideoBlock";
import { ImageLinkBlock } from "@src/documents/pages/blocks/ImageLinkBlock";
import { TeaserBlock } from "@src/documents/pages/blocks/TeaserBlock";
import { NewsDetailBlock } from "@src/news/blocks/NewsDetailBlock";
import { NewsListBlock } from "@src/news/blocks/NewsListBlock";

import { AnchorBlock } from "./AnchorBlock";
import { ColumnsBlock } from "./ColumnsBlock";
import { DamImageBlock } from "./DamImageBlock";
import { FullWidthImageBlock } from "./FullWidthImageBlock";
import { HeadlineBlock } from "./HeadlineBlock";
import { LinkListBlock } from "./LinkListBlock";
import { MediaBlock } from "./MediaBlock";
import RichTextBlock from "./RichTextBlock";
import SpaceBlock from "./SpaceBlock";
import { TextImageBlock } from "./TextImageBlock";
import { TwoListsBlock } from "./TwoListsBlock";

const supportedBlocks: SupportedBlocks = {
    space: (props) => <SpaceBlock data={props} />,
    richtext: (props) => <RichTextBlock data={props} />,
    headline: (props) => <HeadlineBlock data={props} />,
    image: (props) => <DamImageBlock data={props} aspectRatio="inherit" />,
    textImage: (props) => <TextImageBlock data={props} />,
    damVideo: (props) => <DamVideoBlock data={props} />,
    youTubeVideo: (props) => <CookieSafeYouTubeVideoBlock data={props} />,
    linkList: (props) => <LinkListBlock data={props} />,
    fullWidthImage: (props) => <FullWidthImageBlock data={props} />,
    columns: (props) => <ColumnsBlock data={props} />,
    anchor: (props) => <AnchorBlock data={props} />,
    media: (props) => <MediaBlock data={props} />,
    twoLists: (props) => <TwoListsBlock data={props} />,
    teaser: (props) => <TeaserBlock data={props} />,
    newsDetail: (props) => <NewsDetailBlock data={props} />,
    imageLink: (props) => <ImageLinkBlock data={props} />,
    newsList: (props) => <NewsListBlock data={props} />,
};

export const PageContentBlock = ({ data }: PropsWithData<PageContentBlockData>) => {
    return <BlocksBlock data={data} supportedBlocks={supportedBlocks} />;
};
