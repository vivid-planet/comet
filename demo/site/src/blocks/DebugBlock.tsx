import { PixelImageBlock, PropsWithData, withPreview } from "@comet/cms-site";
import { DebugBlockData } from "@src/blocks.generated";
import * as React from "react";
import styled from "styled-components";

import RichTextBlock from "./RichTextBlock";

const DebugBlock = ({ data }: PropsWithData<DebugBlockData>) => {
    return (
        <Root data-debug="debug-block">
            <IconWrapper>
                <PixelImageBlock data={data.icon} objectFit="cover" layout="fill" aspectRatio="1x1" />
            </IconWrapper>
            <ImageWrapper>
                <PixelImageBlock data={data.image} objectFit="cover" layout="fill" aspectRatio="16x9" />
            </ImageWrapper>
            <Content>
                <RichTextBlock data={data.text} />
            </Content>
        </Root>
    );
};

export default withPreview(DebugBlock, { label: "Debug" });

const Root = styled.div`
    position: relative;
    cursor: grab;
    height: 100%;
    overflow: hidden;

    :active {
        cursor: grabbing;
    }
`;

const ImageWrapper = styled.div`
    position: relative;
    overflow: hidden;
    height: 0;
    background-color: lime;
    padding-bottom: 56%;
`;

const IconWrapper = styled.div`
    position: absolute;
    z-index: 1;
    top: 10px;
    right: 10px;
    padding: 10px;
    width: 100px;
    height: 100px;
    border: 5px solid white;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

const Content = styled.div`
    padding: 20px;
`;
