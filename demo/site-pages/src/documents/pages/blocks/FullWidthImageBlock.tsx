import { OptionalBlock, type PropsWithData, withPreview } from "@comet/cms-site";
import { type FullWidthImageBlockData } from "@src/blocks.generated";
import { DamImageBlock } from "@src/common/blocks/DamImageBlock";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import styled from "styled-components";

export const FullWidthImageBlock = withPreview(
    ({ data: { image, content } }: PropsWithData<FullWidthImageBlockData>) => {
        return (
            <Root>
                <DamImageBlock data={image} layout="responsive" sizes="100vw" aspectRatio="16x9" />
                <OptionalBlock
                    block={(props) => (
                        <Content>
                            <RichTextBlock data={props} />
                        </Content>
                    )}
                    data={content}
                />
            </Root>
        );
    },
    { label: "Full Width Image" },
);

const Root = styled.div`
    position: relative;
`;

const Content = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
`;
