import { type PropsWithData, withPreview } from "@comet/cms-site";
import { type TextImageBlockData } from "@src/blocks.generated";
import styled from "styled-components";

import { DamImageBlock } from "./DamImageBlock";
import { RichTextBlock } from "./RichTextBlock";

export const TextImageBlock = withPreview(
    ({ data: { text, image, imageAspectRatio, imagePosition } }: PropsWithData<TextImageBlockData>) => {
        return (
            <Root>
                {imagePosition === "left" && <DamImageBlock data={image} aspectRatio={imageAspectRatio} />}
                <RichTextBlock data={text} />
                {imagePosition === "right" && <DamImageBlock data={image} aspectRatio={imageAspectRatio} />}
            </Root>
        );
    },
    { label: "Text/Image" },
);

const Root = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 20px;
`;
