import { ReactNode } from "react";
import styled, { css } from "styled-components";

import { PixelImageBlockData } from "../../blocks.generated";
import { PixelImageBlock } from "../PixelImageBlock";

export interface VideoPreviewImageProps {
    onPlay: () => void;
    image: PixelImageBlockData;
    aspectRatio: string;
    sizes?: string;
    fill?: boolean;
    icon?: ReactNode;
    className?: string;
}

export const VideoPreviewImage = ({ onPlay, image, aspectRatio, sizes = "100vw", fill, icon = <PlayIcon />, className }: VideoPreviewImageProps) => {
    return (
        <Root $fill={fill} className={className}>
            <PixelImageBlock data={image} aspectRatio={aspectRatio} sizes={sizes} fill={fill} />
            <IconWrapper onClick={onPlay}>{icon}</IconWrapper>
        </Root>
    );
};

const Root = styled.div<{ $fill?: boolean }>`
    position: relative;
    width: 100%;

    ${({ $fill }) =>
        $fill &&
        css`
            height: 100%;
        `}
`;

const IconWrapper = styled.button`
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: black;
    opacity: 0.5;
    appearance: none;
    border: none;
    padding: 0;
    cursor: pointer;
`;

const PlayIcon = styled.span`
    width: 64px;
    height: 64px;
    box-sizing: border-box;
    border-style: solid;
    border-width: 32px 0 32px 64px;
    border-color: transparent transparent transparent white;
`;
