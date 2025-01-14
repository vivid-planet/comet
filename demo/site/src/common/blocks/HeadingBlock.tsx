import { hasRichTextBlockContent, PreviewSkeleton, PropsWithData, WithPreviewComponent } from "@comet/cms-site";
import { styled } from "@pigment-css/react";
import { HeadingBlockData } from "@src/blocks.generated";
import { Typography } from "@src/common/components/Typography";
import { Renderers } from "redraft";

import { createTextBlockRenderFn, defaultRichTextInlineStyleMap, RichTextBlock } from "./RichTextBlock";

const eyebrowRenderers: Renderers = {
    inline: defaultRichTextInlineStyleMap,
};

const getHeadlineRenderers = (htmlTag: keyof HTMLElementTagNameMap): Renderers => ({
    inline: defaultRichTextInlineStyleMap,
    blocks: {
        "header-one": createTextBlockRenderFn({ variant: "h600", as: htmlTag, bottomSpacing: true }),
        "header-two": createTextBlockRenderFn({ variant: "h550", as: htmlTag, bottomSpacing: true }),
        "header-three": createTextBlockRenderFn({ variant: "h500", as: htmlTag, bottomSpacing: true }),
        "header-four": createTextBlockRenderFn({ variant: "h450", as: htmlTag, bottomSpacing: true }),
        "header-five": createTextBlockRenderFn({ variant: "h400", as: htmlTag, bottomSpacing: true }),
        "header-six": createTextBlockRenderFn({ variant: "h350", as: htmlTag, bottomSpacing: true }),
    },
});

const headlineTagMap: Record<HeadingBlockData["htmlTag"], keyof HTMLElementTagNameMap> = {
    H1: "h1",
    H2: "h2",
    H3: "h3",
    H4: "h4",
    H5: "h5",
    H6: "h6",
};

type HeadingBlockProps = PropsWithData<HeadingBlockData>;

export const HeadingBlock = ({ data }: HeadingBlockProps) => {
    const headlineTag = headlineTagMap[data.htmlTag];

    return (
        <WithPreviewComponent label="Heading" data={data}>
            {hasRichTextBlockContent(data.eyebrow) && (
                <Typography variant="h400" as="h5" bottomSpacing>
                    <RichTextBlock data={data.eyebrow} renderers={eyebrowRenderers} />
                </Typography>
            )}
            <PreviewSkeleton
                hasContent={hasRichTextBlockContent(data.headline)}
                title={
                    <HeadlineSkeleton variant="h550" as="span">
                        Headline
                    </HeadlineSkeleton>
                }
            >
                <RichTextBlock data={data.headline} renderers={getHeadlineRenderers(headlineTag)} />
            </PreviewSkeleton>
        </WithPreviewComponent>
    );
};

const HeadlineSkeleton = styled(Typography)`
    color: inherit;
`;
