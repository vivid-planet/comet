"use client";
import { hasRichTextBlockContent, PreviewSkeleton, type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type LinkBlockData, type RichTextBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";
import clsx from "clsx";
import redraft, { type Renderers, type TextBlockRenderFn } from "redraft";

import { Typography, type TypographyProps } from "../components/Typography";
import { isValidLink } from "../helpers/HiddenIfInvalidLink";
import { LinkBlock } from "./LinkBlock";
import styles from "./RichTextBlock.module.scss";

export const createTextBlockRenderFn =
    (props: TypographyProps): TextBlockRenderFn =>
    (children, { keys }) =>
        children.map((child, index) => (
            <Typography key={keys[index]} {...props} className={styles.text}>
                {child}
            </Typography>
        ));

export const defaultRichTextInlineStyleMap: Renderers["inline"] = {
    // The key passed here is just an index based on rendering order inside a block
    BOLD: (children, { key }) => <strong key={key}>{children}</strong>,
    ITALIC: (children, { key }) => <em key={key}>{children}</em>,
    SUB: (children, { key }) => <sub key={key}>{children}</sub>,
    SUP: (children, { key }) => <sup key={key}>{children}</sup>,
    STRIKETHROUGH: (children, { key }) => <s key={key}>{children}</s>,
};

/**
 * Define the renderers
 */
const defaultRichTextRenderers: Renderers = {
    /**
     * Those callbacks will be called recursively to render a nested structure
     */
    inline: defaultRichTextInlineStyleMap,
    /**
     * Blocks receive children and depth
     * Note that children are an array of blocks with same styling,
     */
    blocks: {
        unstyled: createTextBlockRenderFn({ bottomSpacing: true }),
        "paragraph-standard": createTextBlockRenderFn({ bottomSpacing: true }),
        "paragraph-small": createTextBlockRenderFn({ variant: "p200", bottomSpacing: true }),
        "header-one": createTextBlockRenderFn({ variant: "h600", bottomSpacing: true }),
        "header-two": createTextBlockRenderFn({ variant: "h550", bottomSpacing: true }),
        "header-three": createTextBlockRenderFn({ variant: "h500", bottomSpacing: true }),
        "header-four": createTextBlockRenderFn({ variant: "h450", bottomSpacing: true }),
        "header-five": createTextBlockRenderFn({ variant: "h400", bottomSpacing: true }),
        "header-six": createTextBlockRenderFn({ variant: "h350", bottomSpacing: true }),
        // List
        // or depth for nested lists
        "unordered-list-item": (children, { depth, keys }) => (
            <ul key={keys[keys.length - 1]} className={`ul-level-${depth}`}>
                {children.map((child, index) => (
                    <Typography as="li" key={keys[index]} className={styles.text}>
                        {child}
                    </Typography>
                ))}
            </ul>
        ),
        "ordered-list-item": (children, { depth, keys }) => (
            <ol key={keys.join("|")} className={`ol-level-${depth}`}>
                {children.map((child, index) => (
                    <Typography
                        as="li"
                        key={keys[index]}
                        className={clsx(styles.text, styles.orderedListItem, depth % 3 !== 0 && styles[`depth${depth % 3}`])}
                    >
                        {child}
                    </Typography>
                ))}
            </ol>
        ),
    },
    /**
     * Entities receive children and the entity data
     */
    entities: {
        // key is the entity key value from raw
        LINK: (children, data, { key }) =>
            isValidLink(data) ? (
                <LinkBlock key={key} data={data as LinkBlockData} className={styles.inlineLink}>
                    {children}
                </LinkBlock>
            ) : (
                <span>{children}</span>
            ),
    },
};

interface RichTextBlockProps extends PropsWithData<RichTextBlockData> {
    renderers?: Renderers;
    disableLastBottomSpacing?: boolean;
}

export const RichTextBlock = withPreview(
    ({ data, renderers = defaultRichTextRenderers, disableLastBottomSpacing }: RichTextBlockProps) => {
        const rendered = redraft(data.draftContent, renderers);

        return (
            <PreviewSkeleton title="RichText" type="rows" hasContent={hasRichTextBlockContent(data)}>
                {disableLastBottomSpacing ? <div className={styles.disableLastBottomSpacing}>{rendered}</div> : rendered}
            </PreviewSkeleton>
        );
    },
    { label: "Rich Text" },
);

export const PageContentRichTextBlock = (props: RichTextBlockProps) => (
    <PageLayout grid>
        <div className={styles.pageLayoutContent}>
            <RichTextBlock {...props} />
        </div>
    </PageLayout>
);
