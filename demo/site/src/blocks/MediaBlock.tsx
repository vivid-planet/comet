"use client";
import {
    DamVideoBlock,
    OneOfBlock,
    PreviewSkeleton,
    PropsWithData,
    SupportedBlocks,
    VimeoVideoBlock,
    withPreview,
    YouTubeVideoBlock,
} from "@comet/cms-site";
import { MediaBlockData } from "@src/blocks.generated";
import styled from "styled-components";

import { DamImageBlock } from "./DamImageBlock";

const getSupportedBlocks = (sizes: string, aspectRatio: string, fill?: boolean): SupportedBlocks => {
    return {
        image: (data) => <DamImageBlock data={data} sizes={sizes} aspectRatio={aspectRatio} fill={fill} />,
        damVideo: (data) => <DamVideoBlock data={data} previewImageSizes={sizes} aspectRatio={aspectRatio} fill={fill} />,
        youTubeVideo: (data) => <YouTubeVideoBlock data={data} previewImageSizes={sizes} aspectRatio={aspectRatio} fill={fill} />,
        vimeoVideo: (props) => <VimeoVideoBlock data={props} fill={fill} previewImageIcon={<CustomPlayIcon />} />,
    };
};

interface MediaBlockProps extends PropsWithData<MediaBlockData> {
    sizes?: string;
    aspectRatio: string;
    fill?: boolean;
}

export const MediaBlock = withPreview(
    ({ data, sizes = "100vw", aspectRatio, fill }: MediaBlockProps) => {
        return (
            <PreviewSkeleton type="media" hasContent={Boolean(data)}>
                <OneOfBlock data={data} supportedBlocks={getSupportedBlocks(sizes, aspectRatio, fill)} />;
            </PreviewSkeleton>
        );
    },
    { label: "Media" },
);

const CustomPlayIcon = styled.span`
    width: 64px;
    height: 64px;
    box-sizing: border-box;
    border-style: solid;
    border-width: 32px 0 32px 64px;
    border-color: transparent transparent transparent red;
`;
