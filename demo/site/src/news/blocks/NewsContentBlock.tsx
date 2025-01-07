import { BlocksBlock, PropsWithData, SupportedBlocks } from "@comet/cms-site";
import { NewsContentBlockData } from "@src/blocks.generated";
import { DamImageBlock } from "@src/common/blocks/DamImageBlock";
import { HeadingBlock } from "@src/common/blocks/HeadingBlock";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";

const supportedBlocks: SupportedBlocks = {
    heading: (props) => <HeadingBlock data={props} />,
    richText: (props) => <RichTextBlock data={props} />,
    image: (props) => <DamImageBlock data={props} aspectRatio="inherit" />,
};

export const NewsContentBlock = ({ data }: PropsWithData<NewsContentBlockData>) => {
    return <BlocksBlock data={data} supportedBlocks={supportedBlocks} />;
};
