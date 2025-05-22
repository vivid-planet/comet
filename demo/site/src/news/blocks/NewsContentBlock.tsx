<<<<<<< HEAD
import { BlocksBlock, type PropsWithData, type SupportedBlocks } from "@comet/cms-site";
import { type NewsContentBlockData } from "@src/blocks.generated";
=======
import { BlocksBlock, PropsWithData, SupportedBlocks } from "@comet/site-nextjs";
import { NewsContentBlockData } from "@src/blocks.generated";
>>>>>>> main
import { DamImageBlock } from "@src/common/blocks/DamImageBlock";
import { HeadingBlock } from "@src/common/blocks/HeadingBlock";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import { TextImageBlock } from "@src/common/blocks/TextImageBlock";

const supportedBlocks: SupportedBlocks = {
    heading: (props) => <HeadingBlock data={props} />,
    richText: (props) => <RichTextBlock data={props} />,
    image: (props) => <DamImageBlock data={props} aspectRatio="inherit" />,
    textImage: (props) => <TextImageBlock data={props} />,
};

export const NewsContentBlock = ({ data }: PropsWithData<NewsContentBlockData>) => {
    return <BlocksBlock data={data} supportedBlocks={supportedBlocks} />;
};
