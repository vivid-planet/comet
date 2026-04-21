"use client";
import { PreviewSkeleton, type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type TipTapRichTextBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";
import { type ReactNode } from "react";

import { Typography } from "../components/Typography";
import { isValidLink } from "../helpers/HiddenIfInvalidLink";
import { LinkBlock } from "./LinkBlock";
import styles from "./RichTextBlock.module.scss";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TipTapNode = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderMark(mark: { type: string; attrs?: Record<string, any> }, children: ReactNode): ReactNode {
    switch (mark.type) {
        case "bold":
            return <strong>{children}</strong>;
        case "italic":
            return <em>{children}</em>;
        case "strike":
            return <s>{children}</s>;
        case "superscript":
            return <sup>{children}</sup>;
        case "subscript":
            return <sub>{children}</sub>;
        case "link":
            return mark.attrs?.data && isValidLink(mark.attrs.data) ? (
                <LinkBlock data={mark.attrs.data} className={styles.inlineLink}>
                    {children}
                </LinkBlock>
            ) : (
                <>{children}</>
            );
        default:
            return children;
    }
}

function renderInlineContent(node: TipTapNode, index: number): ReactNode {
    if (node.type === "text") {
        let content: ReactNode = node.text;
        if (node.marks) {
            for (const mark of node.marks) {
                content = renderMark(mark, content);
            }
        }
        return <span key={index}>{content}</span>;
    }
    if (node.type === "hardBreak") {
        return <br key={index} />;
    }
    if (node.type === "nonBreakingSpace") {
        return <span key={index}>{"\u00A0"}</span>;
    }
    if (node.type === "softHyphen") {
        return <span key={index}>{"\u00AD"}</span>;
    }
    return null;
}

function renderNode(node: TipTapNode, index: number): ReactNode {
    const children = node.content?.map((child: TipTapNode, i: number) => renderNode(child, i));

    switch (node.type) {
        case "doc":
            return <>{children}</>;
        case "paragraph": {
            const blockStyle = node.attrs?.blockStyle as Parameters<typeof Typography>[0]["variant"];
            return (
                <Typography key={index} variant={blockStyle ?? undefined} bottomSpacing className={styles.text}>
                    {children}
                </Typography>
            );
        }
        case "heading": {
            const level = node.attrs?.level ?? 1;
            const variantMap = {
                1: "headline600",
                2: "headline550",
                3: "headline500",
                4: "headline450",
                5: "headline400",
                6: "headline350",
            } as const;
            return (
                <Typography key={index} variant={variantMap[level as keyof typeof variantMap]} bottomSpacing className={styles.text}>
                    {children}
                </Typography>
            );
        }
        case "bulletList":
            return <ul key={index}>{children}</ul>;
        case "orderedList":
            return <ol key={index}>{children}</ol>;
        case "listItem":
            return (
                <Typography as="li" key={index} className={styles.text}>
                    {children}
                </Typography>
            );
        case "text":
        case "hardBreak":
        case "nonBreakingSpace":
        case "softHyphen":
            return renderInlineContent(node, index);
        default:
            return null;
    }
}

function hasTipTapContent(data: TipTapRichTextBlockData): boolean {
    const content = data.tipTapContent as TipTapNode;
    if (!content?.content || !Array.isArray(content.content)) {
        return false;
    }
    return content.content.some((node: TipTapNode) => node.type !== "paragraph" || (node.content && node.content.length > 0));
}

export const TipTapRichTextBlock = withPreview(
    ({ data }: PropsWithData<TipTapRichTextBlockData>) => {
        const content = data.tipTapContent as TipTapNode;

        return (
            <PreviewSkeleton title="RichText" type="rows" hasContent={hasTipTapContent(data)}>
                {renderNode(content, 0)}
            </PreviewSkeleton>
        );
    },
    { label: "TipTap Rich Text" },
);

export const PageContentTipTapRichTextBlock = (props: PropsWithData<TipTapRichTextBlockData>) => (
    <PageLayout grid>
        <div className={styles.pageLayoutContent}>
            <TipTapRichTextBlock {...props} />
        </div>
    </PageLayout>
);
