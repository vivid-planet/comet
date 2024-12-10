import { BlocksBlock, PropsWithData, SupportedBlocks } from "@comet/cms-site";
import { NewsContentBlockData } from "@src/blocks.generated";
import { DamImageBlock } from "@src/blocks/DamImageBlock";
import { HeadlineBlock } from "@src/blocks/HeadlineBlock";
import { RichTextBlock } from "@src/blocks/RichTextBlock";
import { TextImageBlock } from "@src/blocks/TextImageBlock";

const supportedBlocks: SupportedBlocks = {
    headline: (props) => <HeadlineBlock data={props} />,
    richText: (props) => <RichTextBlock data={props} />,
    image: (props) => <DamImageBlock data={props} aspectRatio="inherit" />,
    textImage: (props) => <TextImageBlock data={props} />,
};

export const NewsContentBlock = ({ data }: PropsWithData<NewsContentBlockData>) => {
    return <BlocksBlock data={data} supportedBlocks={supportedBlocks} />;
};
