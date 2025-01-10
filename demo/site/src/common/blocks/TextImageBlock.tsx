import { PropsWithData } from "@comet/cms-site";
import { styled } from "@pigment-css/react";
import { TextImageBlockData } from "@src/blocks.generated";

import { DamImageBlock } from "./DamImageBlock";
import { RichTextBlock } from "./RichTextBlock";

type TextImageBlockProps = PropsWithData<TextImageBlockData>;

export const TextImageBlock = ({ data: { text, image, imageAspectRatio, imagePosition } }: TextImageBlockProps) => {
    return (
        <Root imagePosition={imagePosition}>
            <ImageContainer>
                <DamImageBlock data={image} aspectRatio={imageAspectRatio} sizes="50vw" />
            </ImageContainer>
            <TextContainer>
                <RichTextBlock data={text} />
            </TextContainer>
        </Root>
    );
};

//export const TextImageBlock = withPreview(TextImageBlock, { label: "Text/Image" });
export const Root = styled("div")<{ imagePosition: TextImageBlockData["imagePosition"] }>({
    display: "flex",
    flexDirection: "row",
    gap: "20px",
    variants: [
        {
            props: {
                imagePosition: "left",
            },
            style: {
                flexDirection: "row-reverse",
            },
        },
    ],
});

export const ImageContainer = styled.div`
    flex: 1;
`;

export const TextContainer = styled.div`
    flex: 2;
`;
