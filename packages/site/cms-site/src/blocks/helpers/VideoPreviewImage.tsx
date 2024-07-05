import * as React from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";

import { PixelImageBlockData } from "../../blocks.generated";
import { PixelImageBlock } from "../PixelImageBlock";

export interface VideoPreviewImageProps {
    onPlay: () => void;
    image: PixelImageBlockData;
    aspectRatio: string;
    sizes?: string;
}

export const VideoPreviewImage = ({ onPlay, image, aspectRatio, sizes = "100vw" }: VideoPreviewImageProps) => {
    const intl = useIntl();
    return (
        <Root onClick={onPlay} aria-label={intl.formatMessage({ id: "videoPreviewImage.ariaLabel.startVideo", defaultMessage: "Start video" })}>
            <PixelImageBlock
                data={image}
                aspectRatio={aspectRatio}
                // TODO: remove layout prop when #2245 is merged (https://github.com/vivid-planet/comet/pull/2245)
                layout="responsive"
                sizes={sizes}
            />
            <IconWrapper>
                <StyledPlayButton />
            </IconWrapper>
        </Root>
    );
};

const Root = styled.button`
    position: relative;
    width: 100%;
    appearance: none;
    background: none;
    border: none;
    padding: 0;
`;

const IconWrapper = styled.span`
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
`;

const StyledPlayButton = styled.span`
    width: 64px;
    height: 64px;
    box-sizing: border-box;
    border-style: solid;
    border-width: 32px 0 32px 64px;
    border-color: transparent transparent transparent white;
`;
