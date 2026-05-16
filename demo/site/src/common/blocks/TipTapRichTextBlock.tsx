"use client";
import { PreviewSkeleton, type PropsWithData, withPreview } from "@comet/site-nextjs";
import type { LinkBlockData, TipTapRichTextBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";
import { cloneElement, isValidElement, type ReactNode } from "react";

import { Typography, type TypographyProps } from "../components/Typography";
import { isValidLink } from "../helpers/HiddenIfInvalidLink";
import { LinkBlock } from "./LinkBlock";
import styles from "./RichTextBlock.module.scss";

interface TipTapMark {
    type: string;
    attrs?: Record<string, unknown>;
}

interface TipTapNode {
    type: string;
    attrs?: Record<string, unknown>;
    content?: TipTapNode[];
    marks?: TipTapMark[];
    text?: string;
}

interface NodeHandlerProps {
    node: TipTapNode;
    parent?: TipTapNode;
    children: ReactNode;
}

interface MarkHandlerProps {
    mark: TipTapMark;
    node: TipTapNode;
    children: ReactNode;
}

type NodeHandler = (props: NodeHandlerProps) => ReactNode;
type MarkHandler = (props: MarkHandlerProps) => ReactNode;

interface RenderTipTapContentOptions {
    content: TipTapNode;
    nodeMapping: Record<string, NodeHandler>;
    markMapping?: Record<string, MarkHandler>;
}

function renderTipTapContent({ content, nodeMapping, markMapping }: RenderTipTapContentOptions): ReactNode {
    const applyMarks = (children: ReactNode, node: TipTapNode): ReactNode => {
        if (!node.marks || node.marks.length === 0) {
            return children;
        }
        let result = children;
        for (const mark of node.marks) {
            const handler = markMapping?.[mark.type];
            if (handler) {
                result = handler({ mark, node, children: result });
            }
        }
        return result;
    };

    const renderNode = (node: TipTapNode, parent: TipTapNode | undefined): ReactNode => {
        if (node.type === "text") {
            return applyMarks(node.text ?? "", node);
        }

        const renderedChildren = node.content?.map((child, index) => {
            const rendered = renderNode(child, node);
            return isValidElement(rendered) ? cloneElement(rendered, { key: index }) : rendered;
        });

        if (node.type === "doc") {
            return <>{renderedChildren}</>;
        }

        const handler = nodeMapping[node.type];
        const rendered = handler ? handler({ node, parent, children: renderedChildren }) : <>{renderedChildren}</>;
        return applyMarks(rendered, node);
    };

    return renderNode(content, undefined);
}

type TypographyVariant = TypographyProps<"p">["variant"];

const headingLevelToVariant: Record<1 | 2 | 3 | 4 | 5 | 6, TypographyVariant> = {
    1: "headline600",
    2: "headline550",
    3: "headline500",
    4: "headline450",
    5: "headline400",
    6: "headline350",
};

const nodeMapping: Record<string, NodeHandler> = {
    paragraph: ({ node, children }) => (
        <Typography variant={(node.attrs?.blockStyle as TypographyVariant | null) ?? undefined} bottomSpacing className={styles.text}>
            {children}
        </Typography>
    ),
    heading: ({ node, children }) => {
        const level = (node.attrs?.level as 1 | 2 | 3 | 4 | 5 | 6) ?? 1;
        return (
            <Typography variant={headingLevelToVariant[level]} bottomSpacing className={styles.text}>
                {children}
            </Typography>
        );
    },
    bulletList: ({ children }) => <ul>{children}</ul>,
    orderedList: ({ children }) => <ol>{children}</ol>,
    listItem: ({ node, children }) => {
        const firstParagraph = node.content?.find((child) => child.type === "paragraph");
        const blockStyle = (firstParagraph?.attrs?.blockStyle as TypographyVariant | null) ?? undefined;
        return (
            <Typography as="li" variant={blockStyle} className={styles.text}>
                {children}
            </Typography>
        );
    },
    hardBreak: () => <br />,
    nonBreakingSpace: () => " ",
    softHyphen: () => "­",
};

const markMapping: Record<string, MarkHandler> = {
    bold: ({ children }) => <strong>{children}</strong>,
    italic: ({ children }) => <em>{children}</em>,
    strike: ({ children }) => <s>{children}</s>,
    superscript: ({ children }) => <sup>{children}</sup>,
    subscript: ({ children }) => <sub>{children}</sub>,
    link: ({ mark, children }) => {
        const linkData = mark.attrs?.data as LinkBlockData | undefined;
        if (!linkData || !isValidLink(linkData)) {
            return <>{children}</>;
        }
        return (
            <LinkBlock data={linkData} className={styles.inlineLink}>
                {children}
            </LinkBlock>
        );
    },
};

function hasTipTapContent(data: TipTapRichTextBlockData): boolean {
    const content = data.tipTapContent as TipTapNode | null | undefined;
    if (!content?.content || !Array.isArray(content.content)) {
        return false;
    }
    return content.content.some((node) => node.type !== "paragraph" || (Array.isArray(node.content) && node.content.length > 0));
}

export const TipTapRichTextBlock = withPreview(
    ({ data }: PropsWithData<TipTapRichTextBlockData>) => (
        <PreviewSkeleton title="RichText" type="rows" hasContent={hasTipTapContent(data)}>
            {renderTipTapContent({ content: data.tipTapContent as TipTapNode, nodeMapping, markMapping })}
        </PreviewSkeleton>
    ),
    { label: "TipTap Rich Text" },
);

export const PageContentTipTapRichTextBlock = (props: PropsWithData<TipTapRichTextBlockData>) => (
    <PageLayout grid>
        <div className={styles.pageLayoutContent}>
            <TipTapRichTextBlock {...props} />
        </div>
    </PageLayout>
);
