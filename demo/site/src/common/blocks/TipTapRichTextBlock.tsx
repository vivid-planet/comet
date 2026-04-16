"use client";
import { PreviewSkeleton, type PropsWithData, withPreview } from "@comet/site-nextjs";
import { PageLayout } from "@src/layout/PageLayout";
import { type ReactNode } from "react";

import { Typography } from "../components/Typography";
import { isValidLink } from "../helpers/HiddenIfInvalidLink";
import { LinkBlock } from "./LinkBlock";
import styles from "./RichTextBlock.module.scss";

/**
 * The block data shape now uses a markdown string instead of TipTap JSON.
 * The generated type will be updated when generators run; this local type
 * serves as the interim definition.
 */
interface TipTapRichTextBlockData {
    markdown: string;
}

// ───────── Markdown → React Rendering ─────────

const COMET_LINK_RE = /\[([^[\]]*)\]\(comet-link:\/\/([A-Za-z0-9+/=]+)\)/;

function decodeLinkData(encoded: string): Record<string, unknown> {
    try {
        return JSON.parse(atob(encoded));
    } catch {
        return {};
    }
}

function renderInlineMarkdown(text: string, keyBase: string): ReactNode[] {
    const nodes: ReactNode[] = [];
    let remaining = text;
    let idx = 0;

    while (remaining.length > 0) {
        // Non-breaking space
        const nbspIndex = remaining.indexOf("\u00A0");
        const shyIndex = remaining.indexOf("\u00AD");
        const boldIndex = remaining.indexOf("**");
        const strikeIndex = remaining.indexOf("~~");
        const linkIndex = remaining.search(COMET_LINK_RE);
        const supIndex = remaining.indexOf("^");
        const tildeIndex = remaining.indexOf("~");

        // Find earliest special token
        const candidates: Array<{ pos: number; type: string }> = [];
        if (nbspIndex >= 0) {
            candidates.push({ pos: nbspIndex, type: "nbsp" });
        }
        if (shyIndex >= 0) {
            candidates.push({ pos: shyIndex, type: "shy" });
        }
        if (boldIndex >= 0) {
            candidates.push({ pos: boldIndex, type: "bold" });
        }
        if (strikeIndex >= 0 && (tildeIndex < 0 || strikeIndex <= tildeIndex)) {
            candidates.push({ pos: strikeIndex, type: "strike" });
        }
        if (linkIndex >= 0) {
            candidates.push({ pos: linkIndex, type: "link" });
        }
        if (supIndex >= 0) {
            candidates.push({ pos: supIndex, type: "sup" });
        }
        // Subscript: single ~ not part of ~~
        if (tildeIndex >= 0 && (strikeIndex < 0 || tildeIndex !== strikeIndex)) {
            candidates.push({ pos: tildeIndex, type: "sub" });
        }
        // Italic: single * not part of **
        const italicIndex = remaining.search(/(?<!\*)\*(?!\*)/);
        if (italicIndex >= 0) {
            candidates.push({ pos: italicIndex, type: "italic" });
        }

        candidates.sort((a, b) => a.pos - b.pos);
        const first = candidates[0];

        if (!first || first.pos === -1) {
            // No more special tokens, push remaining as text
            if (remaining) {
                nodes.push(<span key={`${keyBase}-${idx++}`}>{remaining}</span>);
            }
            break;
        }

        // Push text before the token
        if (first.pos > 0) {
            nodes.push(<span key={`${keyBase}-${idx++}`}>{remaining.slice(0, first.pos)}</span>);
            remaining = remaining.slice(first.pos);
            continue; // re-enter loop at the token position
        }

        switch (first.type) {
            case "nbsp": {
                nodes.push(<span key={`${keyBase}-${idx++}`}>{"\u00A0"}</span>);
                remaining = remaining.slice(1);
                break;
            }
            case "shy": {
                nodes.push(<span key={`${keyBase}-${idx++}`}>{"\u00AD"}</span>);
                remaining = remaining.slice(1);
                break;
            }
            case "bold": {
                const end = remaining.indexOf("**", 2);
                if (end > 0) {
                    const inner = remaining.slice(2, end);
                    nodes.push(<strong key={`${keyBase}-${idx++}`}>{renderInlineMarkdown(inner, `${keyBase}-b-${idx}`)}</strong>);
                    remaining = remaining.slice(end + 2);
                } else {
                    nodes.push(<span key={`${keyBase}-${idx++}`}>**</span>);
                    remaining = remaining.slice(2);
                }
                break;
            }
            case "italic": {
                const end = remaining.indexOf("*", 1);
                if (end > 0 && remaining[end + 1] !== "*") {
                    const inner = remaining.slice(1, end);
                    nodes.push(<em key={`${keyBase}-${idx++}`}>{renderInlineMarkdown(inner, `${keyBase}-i-${idx}`)}</em>);
                    remaining = remaining.slice(end + 1);
                } else {
                    nodes.push(<span key={`${keyBase}-${idx++}`}>*</span>);
                    remaining = remaining.slice(1);
                }
                break;
            }
            case "strike": {
                const end = remaining.indexOf("~~", 2);
                if (end > 0) {
                    const inner = remaining.slice(2, end);
                    nodes.push(<s key={`${keyBase}-${idx++}`}>{renderInlineMarkdown(inner, `${keyBase}-s-${idx}`)}</s>);
                    remaining = remaining.slice(end + 2);
                } else {
                    nodes.push(<span key={`${keyBase}-${idx++}`}>~~</span>);
                    remaining = remaining.slice(2);
                }
                break;
            }
            case "sup": {
                const end = remaining.indexOf("^", 1);
                if (end > 0) {
                    const inner = remaining.slice(1, end);
                    nodes.push(<sup key={`${keyBase}-${idx++}`}>{inner}</sup>);
                    remaining = remaining.slice(end + 1);
                } else {
                    nodes.push(<span key={`${keyBase}-${idx++}`}>^</span>);
                    remaining = remaining.slice(1);
                }
                break;
            }
            case "sub": {
                const end = remaining.indexOf("~", 1);
                if (end > 0 && remaining[end + 1] !== "~") {
                    const inner = remaining.slice(1, end);
                    nodes.push(<sub key={`${keyBase}-${idx++}`}>{inner}</sub>);
                    remaining = remaining.slice(end + 1);
                } else {
                    nodes.push(<span key={`${keyBase}-${idx++}`}>~</span>);
                    remaining = remaining.slice(1);
                }
                break;
            }
            case "link": {
                const match = remaining.match(COMET_LINK_RE);
                if (match) {
                    const linkText = match[1];
                    const linkData = decodeLinkData(match[2]);
                    const linkNode = isValidLink(linkData) ? (
                        <LinkBlock key={`${keyBase}-${idx++}`} data={linkData} className={styles.inlineLink}>
                            {linkText}
                        </LinkBlock>
                    ) : (
                        <span key={`${keyBase}-${idx++}`}>{linkText}</span>
                    );
                    nodes.push(linkNode);
                    remaining = remaining.slice(match[0].length);
                } else {
                    nodes.push(<span key={`${keyBase}-${idx++}`}>[</span>);
                    remaining = remaining.slice(1);
                }
                break;
            }
            default: {
                nodes.push(<span key={`${keyBase}-${idx++}`}>{remaining[0]}</span>);
                remaining = remaining.slice(1);
            }
        }
    }

    return nodes;
}

function extractBlockStyle(text: string): { blockStyle?: string; content: string } {
    const match = text.match(/^\[\.([a-zA-Z0-9_-]+)\]\s*(.*)/s);
    if (match) {
        return { blockStyle: match[1], content: match[2] };
    }
    return { content: text };
}

interface ParsedBlock {
    type: "paragraph" | "heading" | "bulletList" | "orderedList";
    level?: number;
    blockStyle?: string;
    content: string;
    items?: Array<{ blockStyle?: string; content: string }>;
}

function parseMarkdownBlocks(markdown: string): ParsedBlock[] {
    if (!markdown) {
        return [];
    }

    const blocks: ParsedBlock[] = [];
    const lines = markdown.split("\n");
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        if (line.trim() === "") {
            i++;
            continue;
        }

        // Heading
        const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
        if (headingMatch) {
            const level = headingMatch[1].length;
            const { blockStyle, content } = extractBlockStyle(headingMatch[2]);
            blocks.push({ type: "heading", level, blockStyle, content });
            i++;
            continue;
        }

        // Unordered list
        if (/^-\s/.test(line.trim())) {
            const items: Array<{ blockStyle?: string; content: string }> = [];
            while (i < lines.length && /^-\s/.test(lines[i].trim())) {
                const itemText = lines[i].trim().replace(/^-\s+/, "");
                items.push(extractBlockStyle(itemText));
                i++;
            }
            blocks.push({ type: "bulletList", content: "", items });
            continue;
        }

        // Ordered list
        if (/^\d+\.\s/.test(line.trim())) {
            const items: Array<{ blockStyle?: string; content: string }> = [];
            while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
                const itemText = lines[i].trim().replace(/^\d+\.\s+/, "");
                items.push(extractBlockStyle(itemText));
                i++;
            }
            blocks.push({ type: "orderedList", content: "", items });
            continue;
        }

        // Paragraph (may span multiple lines)
        let paragraphText = line;
        i++;
        while (
            i < lines.length &&
            lines[i].trim() !== "" &&
            !/^#{1,6}\s/.test(lines[i]) &&
            !/^-\s/.test(lines[i].trim()) &&
            !/^\d+\.\s/.test(lines[i].trim())
        ) {
            if (paragraphText.endsWith("\\")) {
                paragraphText = `${paragraphText.slice(0, -1)}\n${lines[i]}`;
            } else {
                paragraphText += ` ${lines[i]}`;
            }
            i++;
        }

        const { blockStyle, content } = extractBlockStyle(paragraphText);
        blocks.push({ type: "paragraph", blockStyle, content });
    }

    return blocks;
}

function renderMarkdownContent(markdown: string): ReactNode {
    const blocks = parseMarkdownBlocks(markdown);
    if (blocks.length === 0) {
        return null;
    }

    return (
        <>
            {blocks.map((block, blockIdx) => {
                switch (block.type) {
                    case "heading": {
                        const level = block.level ?? 1;
                        const variantMap = {
                            1: "headline600",
                            2: "headline550",
                            3: "headline500",
                            4: "headline450",
                            5: "headline400",
                            6: "headline350",
                        } as const;
                        return (
                            <Typography
                                key={blockIdx}
                                variant={
                                    (block.blockStyle as Parameters<typeof Typography>[0]["variant"]) ?? variantMap[level as keyof typeof variantMap]
                                }
                                bottomSpacing
                                className={styles.text}
                            >
                                {renderInlineMarkdown(block.content, `h-${blockIdx}`)}
                            </Typography>
                        );
                    }

                    case "bulletList":
                        return (
                            <ul key={blockIdx}>
                                {block.items?.map((item, itemIdx) => (
                                    <Typography as="li" key={itemIdx} className={styles.text}>
                                        {renderInlineMarkdown(item.content, `ul-${blockIdx}-${itemIdx}`)}
                                    </Typography>
                                ))}
                            </ul>
                        );

                    case "orderedList":
                        return (
                            <ol key={blockIdx}>
                                {block.items?.map((item, itemIdx) => (
                                    <Typography as="li" key={itemIdx} className={styles.text}>
                                        {renderInlineMarkdown(item.content, `ol-${blockIdx}-${itemIdx}`)}
                                    </Typography>
                                ))}
                            </ol>
                        );

                    case "paragraph":
                    default:
                        return (
                            <Typography
                                key={blockIdx}
                                variant={(block.blockStyle as Parameters<typeof Typography>[0]["variant"]) ?? undefined}
                                bottomSpacing
                                className={styles.text}
                            >
                                {renderInlineMarkdown(block.content, `p-${blockIdx}`)}
                            </Typography>
                        );
                }
            })}
        </>
    );
}

function hasMarkdownContent(data: TipTapRichTextBlockData): boolean {
    return typeof data.markdown === "string" && data.markdown.trim().length > 0;
}

export const TipTapRichTextBlock = withPreview(
    ({ data }: PropsWithData<TipTapRichTextBlockData>) => {
        return (
            <PreviewSkeleton title="RichText" type="rows" hasContent={hasMarkdownContent(data)}>
                {renderMarkdownContent(data.markdown)}
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
