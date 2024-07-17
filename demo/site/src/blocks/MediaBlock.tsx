"use client";
import { DamVideoBlock, OneOfBlock, PropsWithData, SupportedBlocks, withPreview, YouTubeVideoBlock } from "@comet/cms-site";
import { MediaBlockData } from "@src/blocks.generated";

import { DamImageBlock } from "./DamImageBlock";

const getSupportedBlocks = (fill?: boolean): SupportedBlocks => ({
    image: (props) => <DamImageBlock data={props} aspectRatio="inherit" fill={fill} />,
    damVideo: (props) => <DamVideoBlock data={props} fill={fill} />,
    youTubeVideo: (props) => <YouTubeVideoBlock data={props} fill={fill} />,
});

export const MediaBlock = withPreview(
    ({ data, fill }: PropsWithData<MediaBlockData> & { fill?: boolean }) => {
        return <OneOfBlock data={data} supportedBlocks={getSupportedBlocks(fill)} />;
    },
    { label: "Media" },
);
