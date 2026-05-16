"use client";
import { PreviewSkeleton, type PropsWithData, withPreview } from "@comet/site-nextjs";
import type { LinkBlockData, TipTapRichTextBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";
import { Fragment, type ReactNode } from "react";

import { Typography, type TypographyProps } from "../components/Typography";
import { isValidLink } from "../helpers/HiddenIfInvalidLink";
import { LinkBlock } from "./LinkBlock";
import styles from "./RichTextBlock.module.scss";

// TipTap content types — equivalent to @tiptap/core's JSONContent / Mark types but
// defined locally because the demo site does not depend on @tiptap/* packages.
export interface TipTapMark {
    type: string;
    attrs?: Record<string, unknown>;
}

export interface TipTapNode {
    type: string;
    attrs?: Record<string, unknown>;
    content?: TipTapNode[];
    marks?: TipTapMark[];
    text?: string;
}

export type TipTapMarkRenderer = (mark: TipTapMark, children: ReactNode, key: string) => ReactNode;
export type TipTapNodeRenderer = (node: TipTapNode, key: string, children: ReactNode) => ReactNode;

export interface TipTapRenderers {
    marks?: Record<string, TipTapMarkRenderer>;
    nodes?: Record<string, TipTapNodeRenderer>;
}

type TypographyVariant = NonNullable<TypographyProps<"p">["variant"]>;

const headingVariantMap: Record<number, TypographyVariant> = {
    1: "headline600",
    2: "headline550",
    3: "headline500",
    4: "headline450",
    5: "headline400",
    6: "headline350",
};

export const defaultTipTapMarkRenderers: Record<string, TipTapMarkRenderer> = {
    bold: (_, children, key) => <strong key={key}>{children}</strong>,
    italic: (_, children, key) => <em key={key}>{children}</em>,
    strike: (_, children, key) => <s key={key}>{children}</s>,
    superscript: (_, children, key) => <sup key={key}>{children}</sup>,
    subscript: (_, children, key) => <sub key={key}>{children}</sub>,
    link: (mark, children, key) => {
        const data = mark.attrs?.data as LinkBlockData | undefined;
        if (!data || !isValidLink(data)) {
            return <Fragment key={key}>{children}</Fragment>;
        }
        return (
            <LinkBlock key={key} data={data} className={styles.inlineLink}>
                {children}
            </LinkBlock>
        );
    },
};

export const defaultTipTapNodeRenderers: Record<string, TipTapNodeRenderer> = {
    doc: (_, key, children) => <Fragment key={key}>{children}</Fragment>,
    paragraph: (node, key, children) => {
        const variant = node.attrs?.blockStyle as TypographyVariant | undefined;
        return (
            <Typography key={key} variant={variant} bottomSpacing className={styles.text}>
                {children}
            </Typography>
        );
    },
    heading: (node, key, children) => {
        const level = (node.attrs?.level as number | undefined) ?? 1;
        const variant = headingVariantMap[level] ?? headingVariantMap[1];
        return (
            <Typography key={key} variant={variant} bottomSpacing className={styles.text}>
                {children}
            </Typography>
        );
    },
    bulletList: (_, key, children) => <ul key={key}>{children}</ul>,
    orderedList: (_, key, children) => <ol key={key}>{children}</ol>,
    listItem: (node, key, children) => {
        const firstParagraph = node.content?.find((child) => child.type === "paragraph");
        const variant = firstParagraph?.attrs?.blockStyle as TypographyVariant | undefined;
        return (
            <Typography as="li" key={key} variant={variant} className={styles.text}>
                {children}
            </Typography>
        );
    },
    hardBreak: (_, key) => <br key={key} />,
    nonBreakingSpace: (_, key) => <span key={key}>{"\u00A0"}</span>,
    softHyphen: (_, key) => <span key={key}>{"\u00AD"}</span>,
};

type ResolvedTipTapRenderers = {
    marks: Record<string, TipTapMarkRenderer>;
    nodes: Record<string, TipTapNodeRenderer>;
};

function renderTipTapNodeWith(node: TipTapNode, key: string, renderers: ResolvedTipTapRenderers): ReactNode {
    if (node.type === "text") {
        let content: ReactNode = node.text;
        if (node.marks) {
            node.marks.forEach((mark, markIndex) => {
                const renderMark = renderers.marks[mark.type];
                if (renderMark) {
                    content = renderMark(mark, content, `${key}-mark-${markIndex}`);
                }
            });
        }
        return <Fragment key={key}>{content}</Fragment>;
    }

    const children = node.content?.map((child, index) => renderTipTapNodeWith(child, `${key}-${index}`, renderers));

    const renderNode = renderers.nodes[node.type];
    return renderNode ? renderNode(node, key, children) : null;
}

export function renderTipTapNode(node: TipTapNode, key: string, renderers: TipTapRenderers = {}): ReactNode {
    return renderTipTapNodeWith(node, key, {
        marks: { ...defaultTipTapMarkRenderers, ...renderers.marks },
        nodes: { ...defaultTipTapNodeRenderers, ...renderers.nodes },
    });
}

export function hasTipTapContent(data: TipTapRichTextBlockData): boolean {
    const content = data.tipTapContent as TipTapNode | null | undefined;
    if (!content?.content || !Array.isArray(content.content)) {
        return false;
    }
    return content.content.some((node) => node.type !== "paragraph" || (node.content !== undefined && node.content.length > 0));
}

interface TipTapRichTextBlockProps extends PropsWithData<TipTapRichTextBlockData> {
    renderers?: TipTapRenderers;
}

export const TipTapRichTextBlock = withPreview(
    ({ data, renderers }: TipTapRichTextBlockProps) => {
        const content = data.tipTapContent as TipTapNode;

        return (
            <PreviewSkeleton title="RichText" type="rows" hasContent={hasTipTapContent(data)}>
                {renderTipTapNode(content, "0", renderers)}
            </PreviewSkeleton>
        );
    },
    { label: "TipTap Rich Text" },
);

export const PageContentTipTapRichTextBlock = (props: TipTapRichTextBlockProps) => (
    <PageLayout grid>
        <div className={styles.pageLayoutContent}>
            <TipTapRichTextBlock {...props} />
        </div>
    </PageLayout>
);
