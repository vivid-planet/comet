import { PixelImageBlock, PropsWithData, withPreview } from "@comet/cms-site";
import { PixelImageBlockData, TeaserItemBlockData } from "@src/blocks.generated";
import styled from "styled-components";

export const TeaserItemBlock = withPreview(
    ({ data: { media } }: PropsWithData<TeaserItemBlockData>) => {
        // @ts-expect-error Only used for debugging
        if (media.block?.type !== "image" || media.block.props.activeType !== "pixelImage") {
            return <pre>Use a pixel image</pre>;
        }

        // @ts-expect-error Only used for debugging
        const pixelImageBlockData: PixelImageBlockData = media.block.props.block.props;

        return (
            <div>
                <Root>
                    <div>
                        <Title>Fixed width / 16x9</Title>
                        <ItemWrapper>
                            <FixedWidth16x9Wrapper>
                                <PixelImageBlock data={pixelImageBlockData} aspectRatio="16x9" />
                            </FixedWidth16x9Wrapper>
                            {rightTextContent}
                        </ItemWrapper>
                    </div>
                    <div>
                        <Title>Fixed width / automatic aspect ratio</Title>
                        <ItemWrapper>
                            <FixedWidthAutoAspectRatioWrapper>
                                <PixelImageBlock data={pixelImageBlockData} aspectRatio="inherit" />
                            </FixedWidthAutoAspectRatioWrapper>
                            {rightTextContent}
                        </ItemWrapper>
                    </div>
                    <div>
                        <Title>Fixed width, auto height</Title>
                        <ItemWrapper>
                            <FixedWidthAutoHeightWrapper>
                                <PixelImageBlock data={pixelImageBlockData} aspectRatio="inherit" />
                            </FixedWidthAutoHeightWrapper>
                            {rightTextContent}
                        </ItemWrapper>
                    </div>
                    <div>
                        <Title>Fixed height, auto width</Title>
                        <ItemWrapper>
                            <FixedHeightAutoWidthWrapper>
                                <PixelImageBlock data={pixelImageBlockData} aspectRatio="inherit" />
                            </FixedHeightAutoWidthWrapper>
                            {rightTextContent}
                        </ItemWrapper>
                    </div>
                    {bottomTextContent}
                </Root>
            </div>
        );
    },
    { label: "Teaser Item" },
);

const TextWrapper = styled.p`
    background-color: #f0f0f0;
`;

const rightTextContent = <TextWrapper>Text to the right of an image to check for layout shift.</TextWrapper>;
const bottomTextContent = <TextWrapper>Text to the bottom of an image to check for layout shift.</TextWrapper>;

const Root = styled.div`
    display: flex;
    flex-direction: column;
    gap: 40px;
    max-width: 500px;
`;

const ItemWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: flex-start;
`;

const Title = styled.pre`
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 15px;
`;

const FixedWidth16x9Wrapper = styled.div`
    position: relative;
    width: 200px;
    flex-shrink: 0;
`;

const FixedWidthAutoAspectRatioWrapper = styled.div`
    position: relative;
    width: 200px;
    flex-shrink: 0;
`;

const FixedWidthAutoHeightWrapper = styled.span`
    position: relative;
    width: 200px;
    height: auto;
    flex-shrink: 0;
`;

const FixedHeightAutoWidthWrapper = styled.span`
    position: relative;
    width: auto;
    height: 200px;
    flex-shrink: 0;
`;
