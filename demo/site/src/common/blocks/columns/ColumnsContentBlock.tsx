import { BlocksBlock, PropsWithData, SupportedBlocks } from "@comet/cms-site";
import { ColumnsContentBlockData } from "@src/blocks.generated";
import { LinkListBlock } from "@src/blocks/LinkListBlock";

import { DamImageBlock } from "../DamImageBlock";
import { HeadlineBlock } from "../HeadlineBlock";
import { RichTextBlock } from "../RichTextBlock";
import { SpaceBlock } from "../SpaceBlock";

const supportedBlocks: SupportedBlocks = {
    space: (props) => <SpaceBlock data={props} />,
    richtext: (props) => <RichTextBlock data={props} />,
    headline: (props) => <HeadlineBlock data={props} />,
    image: (props) => <DamImageBlock data={props} aspectRatio="inherit" />,
    linkList: (props) => <LinkListBlock data={props} />,
};

type ColumnsContentBlockProps = PropsWithData<ColumnsContentBlockData>;

export const ColumnsContentBlock = ({ data }: ColumnsContentBlockProps) => {
    return <BlocksBlock data={data} supportedBlocks={supportedBlocks} />;
};

//export default withPreview(ColumnsContentBlock, { label: "Columns content" });
