import { type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type BasicStageBlockData } from "@src/blocks.generated";
import { CallToActionListBlock } from "@src/common/blocks/CallToActionListBlock";
import { HeadingBlock } from "@src/common/blocks/HeadingBlock";
import { MediaBlock } from "@src/common/blocks/MediaBlock";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import { PageLayout } from "@src/layout/PageLayout";
import { type CSSProperties } from "react";
import styled from "styled-components";

export const BasicStageBlock = withPreview(
    ({ data: { media, heading, text, overlay, alignment, callToActionList } }: PropsWithData<BasicStageBlockData>) => (
        <Root>
            <MediaPhone>
                <MediaBlock data={media} aspectRatio="1x2" fill />
            </MediaPhone>
            <MediaTablet>
                <MediaBlock data={media} aspectRatio="1x1" fill />
            </MediaTablet>
            <MediaTabletLandscape>
                <MediaBlock data={media} aspectRatio="3x2" fill />
            </MediaTabletLandscape>
            <MediaDesktop>
                <MediaBlock data={media} aspectRatio="16x9" fill />
            </MediaDesktop>
            <ImageOverlay $overlay={overlay} />
            <AbsoluteGridRoot grid>
                <Content $alignItems={alignment}>
                    <HeadingBlock data={heading} />
                    <RichTextBlock data={text} />
                    <CallToActionListBlock data={callToActionList} />
                </Content>
            </AbsoluteGridRoot>
        </Root>
    ),
    { label: "Stage" },
);

const Root = styled(PageLayout)`
    position: relative;
`;

const ImageOverlay = styled.div<{ $overlay: number }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: ${({ $overlay }) => $overlay}%;
`;

const AbsoluteGridRoot = styled(PageLayout)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

const Content = styled.div<{ $alignItems: CSSProperties["alignItems"] }>`
    grid-column: 3 / -3;
    padding: ${({ theme }) => theme.spacing.d200} 0;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: ${({ $alignItems }) => $alignItems};
    color: ${({ theme }) => theme.palette.text.inverted};
`;

const MediaPhone = styled.div`
    height: 800px;

    ${({ theme }) => theme.breakpoints.sm.mediaQuery} {
        display: none;
    }
`;

const MediaTablet = styled.div`
    display: none;
    height: 700px;

    ${({ theme }) => theme.breakpoints.sm.mediaQuery} {
        display: block;
    }

    ${({ theme }) => theme.breakpoints.md.mediaQuery} {
        display: none;
    }
`;

const MediaTabletLandscape = styled.div`
    display: none;
    height: 650px;

    ${({ theme }) => theme.breakpoints.md.mediaQuery} {
        display: block;
    }

    ${({ theme }) => theme.breakpoints.lg.mediaQuery} {
        display: none;
    }
`;

const MediaDesktop = styled.div`
    display: none;
    height: 750px;

    ${({ theme }) => theme.breakpoints.lg.mediaQuery} {
        display: block;
    }

    ${({ theme }) => theme.breakpoints.xl.mediaQuery} {
        height: 800px;
    }
`;
