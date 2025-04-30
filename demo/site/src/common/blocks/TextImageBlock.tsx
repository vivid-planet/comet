"use client";
import { PropsWithData, withPreview } from "@comet/cms-site";
import { TextImageBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";
import { createImageSizes } from "@src/util/createImageSizes";
import styled, { css } from "styled-components";

import { DamImageBlock } from "./DamImageBlock";
import { RichTextBlock } from "./RichTextBlock";

const TextImageBlock = withPreview(
    ({ data: { text, image, imageAspectRatio, imagePosition } }: PropsWithData<TextImageBlockData>) => {
        return (
            <Root $imagePosition={imagePosition}>
                <ImageContainer $imageAspectRatio={imageAspectRatio.replace("x", "/")}>
                    <DamImageBlock data={image} aspectRatio={imageAspectRatio} fill sizes={createImageSizes({ md: "30vw" }, "100vw")} />
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

const ImageContainer = styled.div<{ $imageAspectRatio: TextImageBlockData["imageAspectRatio"] }>`
    position: relative;
    flex: 1;
    aspect-ratio: ${({ $imageAspectRatio }) => $imageAspectRatio};
`;

const TextContainer = styled.div`
    flex: 2;
`;
