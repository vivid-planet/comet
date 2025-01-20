"use client";
import { hasRichTextBlockContent, PreviewSkeleton, PropsWithData, withPreview } from "@comet/cms-site";
import { LinkBlockData, RichTextBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";
import { Children, isValidElement } from "react";
import redraft, { Renderers, TextBlockRenderFn } from "redraft";
import styled, { css } from "styled-components";

import { Typography, TypographyProps } from "../components/Typography";
import { isValidLink } from "../helpers/HiddenIfInvalidLink";
import { LinkBlock } from "./LinkBlock";

export const createTextBlockRenderFn =
    (props: TypographyProps): TextBlockRenderFn =>
    (children, { keys }) =>
        children.map((child, index) => (
            <Text key={keys[index]} {...props}>
                {child}
            </Text>
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
                    <Text as="li" key={keys[index]}>
                        {child}
                    </Text>
                ))}
            </ul>
        ),
        "ordered-list-item": (children, { depth, keys }) => (
            <ol key={keys.join("|")} className={`ol-level-${depth}`}>
                {children.map((child, index) => (
                    <OrderedListItem $depth={depth} as="li" key={keys[index]}>
                        {child}
                    </OrderedListItem>
                ))}
            </ol>
        ),
    },
    /**
     * Entities receive children and the entity data
     */
    entities: {
        // key is the entity key value from raw
        LINK: (children, data: LinkBlockData, { key }) => {
            const childrenString = extractTextFromChildren(children);
            const mergedKey = childrenString + key;

            return isValidLink(data) ? (
                <InlineLink key={mergedKey} data={data}>
                    {children}
                </InlineLink>
            ) : (
                <span>{children}</span>
            );
        },
    },
};

function extractTextFromChildren(children: React.ReactNode): string {
    return Children.toArray(children)
        .map((child) => {
            if (typeof child === "string" || typeof child === "number") {
                return String(child);
            } else if (isValidElement(child)) {
                return child.props.children ? extractTextFromChildren(child.props.children) : "";
            }
            return "";
        })
        .join("");
}

interface RichTextBlockProps extends PropsWithData<RichTextBlockData> {
    renderers?: Renderers;
    disableLastBottomSpacing?: boolean;
}

export const RichTextBlock = withPreview(
    ({ data, renderers = defaultRichTextRenderers, disableLastBottomSpacing }: RichTextBlockProps) => {
        const rendered = redraft(data.draftContent, renderers);

        return (
            <PreviewSkeleton title="RichText" type="rows" hasContent={hasRichTextBlockContent(data)}>
                {disableLastBottomSpacing ? <DisableLastBottomSpacing>{rendered}</DisableLastBottomSpacing> : rendered}
            </PreviewSkeleton>
        );
    },
    { label: "Rich Text" },
);

export const PageContentRichTextBlock = (props: RichTextBlockProps) => (
    <PageLayout grid>
        <PageLayoutContent>
            <RichTextBlock {...props} />
        </PageLayoutContent>
    </PageLayout>
);

const DisableLastBottomSpacing = styled.div`
    ${({ theme }) =>
        css`
            > *:last-child {
                margin-bottom: 0;

                ${theme.breakpoints.xs.mediaQuery} {
                    margin-bottom: 0;
                }
            }
        `};
`;

const Text = styled(Typography)`
    white-space: pre-line;

    /* Show empty lines as spacing between paragraphs */
    &:empty:not(:first-child:last-child)::before {
        white-space: pre;
        content: " ";
    }
`;

const OrderedListItem = styled(Text)<{ $depth: number }>`
    list-style-type: ${({ $depth }) => ($depth % 3 === 1 ? "lower-alpha" : $depth % 3 === 2 ? "lower-roman" : "decimal")};
`;

const InlineLink = styled(LinkBlock)`
    color: ${({ theme }) => theme.palette.primary.main};
    transition: color 0.3s ease-in-out;

    &:hover {
        color: ${({ theme }) => theme.palette.primary.dark};
    }
`;

const PageLayoutContent = styled.div`
    grid-column: 3 / -3;
`;
