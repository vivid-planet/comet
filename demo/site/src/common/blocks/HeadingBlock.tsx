"use client";
import { hasRichTextBlockContent, PreviewSkeleton, PropsWithData, withPreview } from "@comet/cms-site";
import { HeadingBlockData } from "@src/blocks.generated";
import { Typography } from "@src/common/components/Typography";
import { Renderers } from "redraft";
import styled from "styled-components";

import { createTextBlockRenderFn, defaultRichTextInlineStyleMap, RichTextBlock } from "./RichTextBlock";

const eyebrowRenderers: Renderers = {
    inline: defaultRichTextInlineStyleMap,
};

const getHeadingRenderers = (htmlTag: keyof HTMLElementTagNameMap): Renderers => ({
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

const headingTagMap: Record<HeadingBlockData["htmlTag"], keyof HTMLElementTagNameMap> = {
    H1: "h1",
    H2: "h2",
    H3: "h3",
    H4: "h4",
    H5: "h5",
    H6: "h6",
};

type HeadingBlockProps = PropsWithData<HeadingBlockData>;

export const HeadingBlock = withPreview(
    ({ data: { eyebrow, heading, htmlTag } }: HeadingBlockProps) => {
        const headingTag = headingTagMap[htmlTag];

        return (
            <>
                {hasRichTextBlockContent(eyebrow) && (
                    <Typography variant="h400" as="h5" bottomSpacing>
                        <RichTextBlock data={eyebrow} renderers={eyebrowRenderers} />
                    </Typography>
                )}
                <PreviewSkeleton
                    hasContent={hasRichTextBlockContent(heading)}
                    title={
                        <HeadingSkeleton variant="h550" as="span">
                            Heading
                        </HeadingSkeleton>
                    }
                >
                    <RichTextBlock data={heading} renderers={getHeadingRenderers(headingTag)} />
                </PreviewSkeleton>
            </>
        );
    },
    { label: "Heading" },
);

const HeadingSkeleton = styled(Typography)`
    color: inherit;
`;
