"use client";
import { hasRichTextBlockContent, PreviewSkeleton, type PropsWithData, withPreview } from "@comet/site-nextjs";
import type { HeadingBlockData, RichTextBlockData } from "@src/blocks.generated";
import { Typography, type TypographyVariant } from "@src/common/components/Typography";
import type { Renderers } from "redraft";

import { createTextBlockRenderFn, defaultRichTextInlineStyleMap, RichTextBlock } from "./RichTextBlock";

const eyebrowRenderers: Renderers = {
    inline: defaultRichTextInlineStyleMap,
};

const getHeadlineRenderers = (htmlTag: keyof HTMLElementTagNameMap): Renderers => ({
    inline: defaultRichTextInlineStyleMap,
    blocks: {
        "header-one": createTextBlockRenderFn({ variant: "headline600", as: htmlTag, bottomSpacing: true }),
        "header-two": createTextBlockRenderFn({ variant: "headline550", as: htmlTag, bottomSpacing: true }),
        "header-three": createTextBlockRenderFn({ variant: "headline500", as: htmlTag, bottomSpacing: true }),
        "header-four": createTextBlockRenderFn({ variant: "headline450", as: htmlTag, bottomSpacing: true }),
        "header-five": createTextBlockRenderFn({ variant: "headline400", as: htmlTag, bottomSpacing: true }),
        "header-six": createTextBlockRenderFn({ variant: "headline350", as: htmlTag, bottomSpacing: true }),
    },
});

const headlineTagMap: Record<HeadingBlockData["htmlTag"], keyof HTMLElementTagNameMap> = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
};

/**
 * The eyebrow follows the size of the headline it belongs to.
 * The design only defines eyebrow sizes down to the fourth headline size, so the smallest eyebrow is reused for the two smallest headlines.
 */
const eyebrowVariantMap = {
    "header-one": "eyebrow600",
    "header-two": "eyebrow550",
    "header-three": "eyebrow500",
    "header-four": "eyebrow450",
    "header-five": "eyebrow450",
    "header-six": "eyebrow450",
} satisfies Record<string, TypographyVariant>;

type HeadlineBlockType = keyof typeof eyebrowVariantMap;

// Matches the standardBlockType of the headline rich text in Admin
const defaultHeadlineBlockType: HeadlineBlockType = "header-one";

const isHeadlineBlockType = (blockType: string): blockType is HeadlineBlockType => blockType in eyebrowVariantMap;

const getHeadlineBlockType = (headline: RichTextBlockData): HeadlineBlockType => {
    // The headline rich text is limited to a single block, whose type determines the headline size.
    const [block] = (headline.draftContent as { blocks?: { type?: string }[] } | undefined)?.blocks ?? [];
    return block?.type !== undefined && isHeadlineBlockType(block.type) ? block.type : defaultHeadlineBlockType;
};

type HeadingBlockProps = PropsWithData<HeadingBlockData>;

export const HeadingBlock = withPreview(
    ({ data: { eyebrow, headline, htmlTag } }: HeadingBlockProps) => {
        const headlineTag = headlineTagMap[htmlTag];

        return (
            <>
                {hasRichTextBlockContent(eyebrow) && (
                    <Typography variant={eyebrowVariantMap[getHeadlineBlockType(headline)]} as="p" bottomSpacing>
                        <RichTextBlock data={eyebrow} renderers={eyebrowRenderers} />
                    </Typography>
                )}
                <PreviewSkeleton
                    hasContent={hasRichTextBlockContent(headline)}
                    title={
                        <Typography variant="headline550" as="span">
                            Headline
                        </Typography>
                    }
                >
                    <RichTextBlock data={headline} renderers={getHeadlineRenderers(headlineTag)} />
                </PreviewSkeleton>
            </>
        );
    },
    { label: "Heading" },
);
