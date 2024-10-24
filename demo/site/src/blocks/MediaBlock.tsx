"use client";
import { DamVideoBlock, OneOfBlock, PropsWithData, SupportedBlocks, VimeoVideoBlock, withPreview, YouTubeVideoBlock } from "@comet/cms-site";
import { MediaBlockData } from "@src/blocks.generated";
import styled from "styled-components";

import { DamImageBlock } from "./DamImageBlock";

const getSupportedBlocks = (fill?: boolean): SupportedBlocks => ({
    image: (props) => <DamImageBlock data={props} aspectRatio="inherit" fill={fill} />,
    damVideo: (props) => <DamVideoBlock data={props} fill={fill} previewImageIcon={<CustomPlayIcon />} />,
    youTubeVideo: (props) => <YouTubeVideoBlock data={props} fill={fill} previewImageIcon={<CustomPlayIcon />} />,
    vimeoVideo: (props) => <VimeoVideoBlock data={props} fill={fill} previewImageIcon={<CustomPlayIcon />} />,
});

export const MediaBlock = withPreview(
    ({ data, fill }: PropsWithData<MediaBlockData> & { fill?: boolean }) => {
        return <OneOfBlock data={data} supportedBlocks={getSupportedBlocks(fill)} />;
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
