import { DamVideoBlock, OneOfBlock, PropsWithData, SupportedBlocks, VimeoVideoBlock, withPreview, YouTubeVideoBlock } from "@comet/cms-site";
import { VideoBlockData } from "@src/blocks.generated";
import * as React from "react";

const supportedBlocks: SupportedBlocks = {
    youtubeVideo: (props) => <YouTubeVideoBlock data={props} />,
    damVideo: (props) => <DamVideoBlock data={props} />,
    vimeoVideo: (props) => <VimeoVideoBlock data={props} />,
};

const VideoBlock = withPreview(
    ({ data }: PropsWithData<VideoBlockData>) => {
        return <OneOfBlock data={data} supportedBlocks={supportedBlocks} />;
    },
    { label: "Video" },
);

export { VideoBlock };
