"use client";
import { PreviewSkeleton, type PropsWithData, withPreview } from "@comet/site-nextjs";
import type { LinkBlockData, TipTapRichTextBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";
import { type Extensions, type JSONContent, Mark, mergeAttributes, Node } from "@tiptap/core";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import StarterKit from "@tiptap/starter-kit";
import { renderToReactElement } from "@tiptap/static-renderer/pm/react";

import { Typography, type TypographyProps } from "../components/Typography";
import { isValidLink } from "../helpers/HiddenIfInvalidLink";
import { LinkBlock } from "./LinkBlock";
import styles from "./RichTextBlock.module.scss";

const BlockStyleParagraph = Paragraph.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            blockStyle: { default: null },
        };
    },
});

const BlockStyleHeading = Heading.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            blockStyle: { default: null },
        };
    },
});

const CmsLink = Mark.create({
    name: "link",
    inclusive: false,

    addAttributes() {
        return {
            data: { default: null },
        };
    },

    parseHTML() {
        return [{ tag: "a[data-cms-link]" }];
    },

    renderHTML({ HTMLAttributes }) {
        return ["a", mergeAttributes(HTMLAttributes, { "data-cms-link": "" }), 0];
    },
});

const NonBreakingSpace = Node.create({
    name: "nonBreakingSpace",
    group: "inline",
    inline: true,
    selectable: false,
    atom: true,

    parseHTML() {
        return [{ tag: "span[data-type='non-breaking-space']" }];
    },

    renderHTML({ HTMLAttributes }) {
        return ["span", mergeAttributes(HTMLAttributes, { "data-type": "non-breaking-space" }), " "];
    },
});

const SoftHyphen = Node.create({
    name: "softHyphen",
    group: "inline",
    inline: true,
    selectable: false,
    atom: true,

    parseHTML() {
        return [{ tag: "span[data-type='soft-hyphen']" }];
    },

    renderHTML({ HTMLAttributes }) {
        return ["span", mergeAttributes(HTMLAttributes, { "data-type": "soft-hyphen" }), "­"];
    },
});

const extensions: Extensions = [
    StarterKit.configure({
        heading: false,
        paragraph: false,
        blockquote: false,
        code: false,
        codeBlock: false,
        link: false,
    }),
    BlockStyleParagraph,
    BlockStyleHeading,
    Superscript,
    Subscript,
    NonBreakingSpace,
    SoftHyphen,
    CmsLink,
];

type TypographyVariant = TypographyProps<"p">["variant"];

const headingLevelToVariant: Record<1 | 2 | 3 | 4 | 5 | 6, TypographyVariant> = {
    1: "headline600",
    2: "headline550",
    3: "headline500",
    4: "headline450",
    5: "headline400",
    6: "headline350",
};

function findFirstParagraphBlockStyle(node: {
    content: { forEach: (cb: (child: { type: { name: string }; attrs: Record<string, unknown> }) => void) => void };
}): TypographyVariant | undefined {
    let result: TypographyVariant | undefined;
    node.content.forEach((child) => {
        if (!result && child.type.name === "paragraph") {
            result = (child.attrs.blockStyle as TypographyVariant | null) ?? undefined;
        }
    });
    return result;
}

function renderTipTapContent(content: JSONContent) {
    return renderToReactElement({
        content,
        extensions,
        options: {
            nodeMapping: {
                paragraph: ({ node, children }) => (
                    <Typography variant={(node.attrs.blockStyle as TypographyVariant | null) ?? undefined} bottomSpacing className={styles.text}>
                        {children}
                    </Typography>
                ),
                heading: ({ node, children }) => {
                    const level = node.attrs.level as 1 | 2 | 3 | 4 | 5 | 6;
                    return (
                        <Typography variant={headingLevelToVariant[level]} bottomSpacing className={styles.text}>
                            {children}
                        </Typography>
                    );
                },
                listItem: ({ node, children }) => (
                    <Typography as="li" variant={findFirstParagraphBlockStyle(node)} className={styles.text}>
                        {children}
                    </Typography>
                ),
                hardBreak: () => <br />,
                nonBreakingSpace: () => <>{" "}</>,
                softHyphen: () => <>­</>,
            },
            markMapping: {
                link: ({ mark, children }) => {
                    const linkData = mark.attrs.data as LinkBlockData | undefined;
                    if (!linkData || !isValidLink(linkData)) {
                        return <>{children}</>;
                    }
                    return (
                        <LinkBlock data={linkData} className={styles.inlineLink}>
                            {children}
                        </LinkBlock>
                    );
                },
            },
        },
    });
}

function hasTipTapContent(data: TipTapRichTextBlockData): boolean {
    const content = data.tipTapContent as JSONContent;
    if (!content?.content || !Array.isArray(content.content)) {
        return false;
    }
    return content.content.some((node) => node.type !== "paragraph" || (Array.isArray(node.content) && node.content.length > 0));
}

export const TipTapRichTextBlock = withPreview(
    ({ data }: PropsWithData<TipTapRichTextBlockData>) => (
        <PreviewSkeleton title="RichText" type="rows" hasContent={hasTipTapContent(data)}>
            {renderTipTapContent(data.tipTapContent as JSONContent)}
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
