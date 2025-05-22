"use client";
<<<<<<< HEAD
import { type PropsWithData, withPreview } from "@comet/cms-site";
import { type TextImageBlockData } from "@src/blocks.generated";
=======
import { PropsWithData, withPreview } from "@comet/site-nextjs";
import { TextImageBlockData } from "@src/blocks.generated";
>>>>>>> main
import styled, { css } from "styled-components";

import { DamImageBlock } from "./DamImageBlock";
import { RichTextBlock } from "./RichTextBlock";

export const TextImageBlock = withPreview(
    ({ data: { text, image, imageAspectRatio, imagePosition } }: PropsWithData<TextImageBlockData>) => {
        return (
            <Root $imagePosition={imagePosition}>
                <ImageContainer>
                    <DamImageBlock data={image} aspectRatio={imageAspectRatio} sizes="50vw" />
                </ImageContainer>
                <TextContainer>
                    <RichTextBlock data={text} />
                </TextContainer>
            </Root>
        );
    },
    { label: "Text/Image" },
);

const Root = styled.div<{ $imagePosition: TextImageBlockData["imagePosition"] }>`
    display: flex;
    flex-direction: row;
    gap: 20px;

    ${({ $imagePosition }) =>
        $imagePosition === "left" &&
        css`
            flex-direction: row-reverse;
        `}
`;

const ImageContainer = styled.div`
    flex: 1;
`;

const TextContainer = styled.div`
    flex: 2;
`;
