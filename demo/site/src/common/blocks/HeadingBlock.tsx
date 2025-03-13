"use client";
import { hasRichTextBlockContent, PreviewSkeleton, type PropsWithData, withPreview } from "@comet/cms-site";
import { type HeadingBlockData } from "@src/blocks.generated";
import { Typography } from "@src/common/components/Typography";
import { type Renderers } from "redraft";
import styled from "styled-components";

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

export const HeadingBlock = withPreview(
    ({ data: { eyebrow, headline, htmlTag } }: HeadingBlockProps) => {
        const headlineTag = headlineTagMap[htmlTag];

        return (
            <>
                {hasRichTextBlockContent(eyebrow) && (
                    <Typography variant="h400" as="h5" bottomSpacing>
                        <RichTextBlock data={eyebrow} renderers={eyebrowRenderers} />
                    </Typography>
                )}
                <PreviewSkeleton
                    hasContent={hasRichTextBlockContent(headline)}
                    title={
                        <HeadlineSkeleton variant="h550" as="span">
                            Headline
                        </HeadlineSkeleton>
                    }
                >
                    <RichTextBlock data={headline} renderers={getHeadlineRenderers(headlineTag)} />
                </PreviewSkeleton>
            </>
        );
    },
    { label: "Heading" },
);

const HeadlineSkeleton = styled(Typography)`
    color: inherit;
`;
