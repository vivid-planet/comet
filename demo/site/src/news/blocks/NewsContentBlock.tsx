import { BlocksBlock, PropsWithData, SupportedBlocks } from "@comet/cms-site";
import { NewsContentBlockData } from "@src/blocks.generated";
import { DamImageBlock } from "@src/blocks/DamImageBlock";
import { HeadlineBlock } from "@src/blocks/HeadlineBlock";
import { LinkListBlock } from "@src/blocks/LinkListBlock";
import RichTextBlock from "@src/blocks/RichTextBlock";
import { TextImageBlock } from "@src/blocks/TextImageBlock";
import * as React from "react";

const supportedBlocks: SupportedBlocks = {
    headline: (props) => <HeadlineBlock data={props} />,
    richtext: (props) => <RichTextBlock data={props} />,
    image: (props) => <DamImageBlock data={props} />,
    textImage: (props) => <TextImageBlock data={props} />,
    linkList: (props) => <LinkListBlock data={props} />,
};

export const NewsContentBlock: React.FC<PropsWithData<NewsContentBlockData>> = ({ data }) => {
    return <BlocksBlock data={data} supportedBlocks={supportedBlocks} />;
};
