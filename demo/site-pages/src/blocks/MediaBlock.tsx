import { DamVideoBlock, OneOfBlock, PropsWithData, SupportedBlocks, VimeoVideoBlock, withPreview, YouTubeVideoBlock } from "@comet/cms-site";
import { MediaBlockData } from "@src/blocks.generated";

import { DamImageBlock } from "./DamImageBlock";

const supportedBlocks: SupportedBlocks = {
    image: (props) => <DamImageBlock data={props} aspectRatio="inherit" />,
    video: (props) => <DamVideoBlock data={props} />,
    youTubeVideo: (props) => <YouTubeVideoBlock data={props} />,
    vimeoVideo: (props) => <VimeoVideoBlock data={props} />,
};

export const MediaBlock = withPreview(
    ({ data }: PropsWithData<MediaBlockData>) => {
        return <OneOfBlock data={data} supportedBlocks={supportedBlocks} />;
    },
    { label: "Media" },
);
