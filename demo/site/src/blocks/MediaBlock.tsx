"use client";
import { DamVideoBlock, OneOfBlock, PropsWithData, SupportedBlocks, withPreview, YouTubeVideoBlock } from "@comet/cms-site";
import { MediaBlockData } from "@src/blocks.generated";
import { VideoPreviewImage } from "@src/blocks/helpers/VideoPreviewImage";

import { DamImageBlock } from "./DamImageBlock";

const supportedBlocks: SupportedBlocks = {
    image: (props) => <DamImageBlock data={props} aspectRatio="inherit" />,
    damVideo: (props) => <DamVideoBlock data={props} VideoPreviewImage={VideoPreviewImage} />,
    youTubeVideo: (props) => <YouTubeVideoBlock data={props} VideoPreviewImage={VideoPreviewImage} />,
};

export const MediaBlock = withPreview(
    ({ data }: PropsWithData<MediaBlockData>) => {
        return <OneOfBlock data={data} supportedBlocks={supportedBlocks} />;
    },
    { label: "Media" },
);
