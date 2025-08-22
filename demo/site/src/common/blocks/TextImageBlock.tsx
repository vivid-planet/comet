"use client";
import { type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type TextImageBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";
import { createImageSizes } from "@src/util/createImageSizes";
import styled, { css } from "styled-components";

import { DamImageBlock } from "./DamImageBlock";
import { RichTextBlock } from "./RichTextBlock";

export const TextImageBlock = withPreview(
    ({ data: { text, image, imageAspectRatio, imagePosition } }: PropsWithData<TextImageBlockData>) => {
        return (
            <Root $imagePosition={imagePosition}>
                <ImageContainer>
                    <DamImageBlock data={image} aspectRatio={imageAspectRatio} sizes={createImageSizes({ default: "100vw", md: "30vw" })} />
                </ImageContainer>
                <TextContainer>
                    <RichTextBlock data={text} />
                </TextContainer>
            </Root>
        );
    },
    { label: "Text/Image" },
);

export const PageContentTextImageBlock = (props: PropsWithData<TextImageBlockData>) => (
    <PageLayout>
        <TextImageBlock {...props} />
    </PageLayout>
);

const Root = styled.div<{ $imagePosition: TextImageBlockData["imagePosition"] }>`
    display: flex;
    flex-direction: column;
    gap: 20px;

    ${({ theme }) => theme.breakpoints.md.mediaQuery} {
        flex-direction: row;
    }

    ${({ $imagePosition }) =>
        $imagePosition === "left" &&
        css`
            flex-direction: row-reverse;
        `}
`;

const ImageContainer = styled.div`
    position: relative;
    flex: 1;
`;

const TextContainer = styled.div`
    flex: 2;
`;
