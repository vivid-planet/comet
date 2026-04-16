/**
 * Comet-Flavoured Markdown ↔ TipTap JSON Converters
 *
 * These converters handle the transformation between the comet-flavoured markdown
 * storage format and the TipTap JSONContent used internally by the editor.
 *
 * Markdown Specification:
 * - **bold** → bold mark
 * - *italic* → italic mark
 * - ~~strike~~ → strike mark
 * - ^superscript^ → superscript mark
 * - ~subscript~ → subscript mark
 * - U+00A0 → nonBreakingSpace node
 * - U+00AD → softHyphen node
 * - # Heading 1 … ###### Heading 6
 * - Unordered lists: - item
 * - Ordered lists: 1. item
 * - [.styleName] prefix → blockStyle attribute
 * - [Link Text](comet-link://BASE64_JSON) → link mark with data
 * - Hard break: trailing backslash + newline
 */
import type { JSONContent } from "@tiptap/react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LinkData = Record<string, any>;

const COMET_LINK_RE = /\[([^\]]*)\]\(comet-link:\/\/([A-Za-z0-9+/=]+)\)/g;

function encodeLinkData(data: LinkData): string {
    return btoa(JSON.stringify(data));
}

function decodeLinkData(encoded: string): LinkData {
    return JSON.parse(atob(encoded));
}

// ───────────────────────── TipTap JSON → Markdown ─────────────────────────

function serializeMarks(node: JSONContent): string {
    if (!node.text && node.type !== "nonBreakingSpace" && node.type !== "softHyphen" && node.type !== "hardBreak") {
        return "";
    }

    let text = node.text ?? "";

    // Handle special inline nodes
    if (node.type === "nonBreakingSpace") {
        return "\u00A0";
    }
    if (node.type === "softHyphen") {
        return "\u00AD";
    }
    if (node.type === "hardBreak") {
        return "\\\n";
    }

    if (!node.marks || node.marks.length === 0) {
        return text;
    }

    // Apply marks from innermost to outermost
    for (const mark of node.marks) {
        switch (mark.type) {
            case "bold":
                text = `**${text}**`;
                break;
            case "italic":
                text = `*${text}*`;
                break;
            case "strike":
                text = `~~${text}~~`;
                break;
            case "superscript":
                text = `^${text}^`;
                break;
            case "subscript":
                text = `~${text}~`;
                break;
            case "link":
                if (mark.attrs?.data) {
                    const encoded = encodeLinkData(mark.attrs.data);
                    text = `[${text}](comet-link://${encoded})`;
                }
                break;
        }
    }

    return text;
}

function serializeInlineContent(nodes: JSONContent[]): string {
    return nodes.map((node) => serializeMarks(node)).join("");
}

function serializeBlockStyle(attrs?: Record<string, unknown>): string {
    if (attrs?.blockStyle && typeof attrs.blockStyle === "string") {
        return `[.${attrs.blockStyle}] `;
    }
    return "";
}

function serializeNode(node: JSONContent): string {
    switch (node.type) {
        case "doc":
            return (node.content ?? []).map(serializeNode).join("\n\n");

        case "paragraph": {
            const stylePrefix = serializeBlockStyle(node.attrs);
            const inline = node.content ? serializeInlineContent(node.content) : "";
            return `${stylePrefix}${inline}`;
        }

        case "heading": {
            const level = node.attrs?.level ?? 1;
            const hashes = "#".repeat(level);
            const stylePrefix = serializeBlockStyle(node.attrs);
            const inline = node.content ? serializeInlineContent(node.content) : "";
            return `${hashes} ${stylePrefix}${inline}`;
        }

        case "bulletList":
            return (node.content ?? []).map((item) => serializeListItem(item, "- ")).join("\n");

        case "orderedList":
            return (node.content ?? []).map((item, i) => serializeListItem(item, `${i + 1}. `)).join("\n");

        case "listItem": {
            // List items contain paragraphs
            return (node.content ?? []).map(serializeNode).join("\n");
        }

        default:
            // Inline nodes at block level (shouldn't happen normally)
            return serializeMarks(node);
    }
}

function serializeListItem(item: JSONContent, prefix: string): string {
    if (!item.content || item.content.length === 0) {
        return prefix;
    }

    // First paragraph gets the list prefix
    const firstParagraph = item.content[0];
    const stylePrefix = serializeBlockStyle(firstParagraph.attrs);
    const inline = firstParagraph.content ? serializeInlineContent(firstParagraph.content) : "";

    return `${prefix}${stylePrefix}${inline}`;
}

/**
 * Convert TipTap JSONContent to comet-flavoured markdown
 */
export function tipTapJsonToMarkdown(content: JSONContent): string {
    if (!content || content.type !== "doc") {
        return "";
    }
    return serializeNode(content);
}

// ───────────────────────── Markdown → TipTap JSON ─────────────────────────

interface ParsedBlock {
    type: "paragraph" | "heading" | "bulletList" | "orderedList";
    level?: number;
    blockStyle?: string;
    inlineContent: string;
    listItems?: ParsedBlock[];
}

function parseBlocks(markdown: string): ParsedBlock[] {
    if (!markdown) {
        return [];
    }

    const blocks: ParsedBlock[] = [];
    const lines = markdown.split("\n");
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Empty line = paragraph separator (skip)
        if (line.trim() === "") {
            i++;
            continue;
        }

        // Heading: # text
        const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
        if (headingMatch) {
            const level = headingMatch[1].length;
            const { blockStyle, content } = extractBlockStyle(headingMatch[2]);
            blocks.push({ type: "heading", level, blockStyle, inlineContent: content });
            i++;
            continue;
        }

        // Unordered list: - item
        if (/^-\s/.test(line.trim())) {
            const items: ParsedBlock[] = [];
            while (i < lines.length && /^-\s/.test(lines[i].trim())) {
                const itemContent = lines[i].trim().replace(/^-\s+/, "");
                const { blockStyle, content } = extractBlockStyle(itemContent);
                items.push({ type: "paragraph", blockStyle, inlineContent: content });
                i++;
            }
            blocks.push({ type: "bulletList", inlineContent: "", listItems: items });
            continue;
        }

        // Ordered list: 1. item
        if (/^\d+\.\s/.test(line.trim())) {
            const items: ParsedBlock[] = [];
            while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
                const itemContent = lines[i].trim().replace(/^\d+\.\s+/, "");
                const { blockStyle, content } = extractBlockStyle(itemContent);
                items.push({ type: "paragraph", blockStyle, inlineContent: content });
                i++;
            }
            blocks.push({ type: "orderedList", inlineContent: "", listItems: items });
            continue;
        }

        // Regular paragraph (may span multiple lines until blank line)
        let paragraphText = line;
        i++;
        while (
            i < lines.length &&
            lines[i].trim() !== "" &&
            !/^#{1,6}\s/.test(lines[i]) &&
            !/^-\s/.test(lines[i].trim()) &&
            !/^\d+\.\s/.test(lines[i].trim())
        ) {
            // Handle hard breaks (trailing backslash)
            if (paragraphText.endsWith("\\")) {
                paragraphText = `${paragraphText.slice(0, -1)}\n${lines[i]}`;
            } else {
                paragraphText += ` ${lines[i]}`;
            }
            i++;
        }

        const { blockStyle, content } = extractBlockStyle(paragraphText);
        blocks.push({ type: "paragraph", blockStyle, inlineContent: content });
    }

    return blocks;
}

function extractBlockStyle(text: string): { blockStyle?: string; content: string } {
    const match = text.match(/^\[\.([a-zA-Z0-9_-]+)\]\s*(.*)/s);
    if (match) {
        return { blockStyle: match[1], content: match[2] };
    }
    return { content: text };
}

interface InlineToken {
    type: "text" | "nonBreakingSpace" | "softHyphen" | "hardBreak";
    text?: string;
    marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
}

function parseInlineContent(text: string): InlineToken[] {
    if (!text) {
        return [];
    }

    const tokens: InlineToken[] = [];
    let remaining = text;

    while (remaining.length > 0) {
        // Check for hard break
        if (remaining.startsWith("\n")) {
            tokens.push({ type: "hardBreak" });
            remaining = remaining.slice(1);
            continue;
        }

        // Check for non-breaking space
        if (remaining.startsWith("\u00A0")) {
            tokens.push({ type: "nonBreakingSpace" });
            remaining = remaining.slice(1);
            continue;
        }

        // Check for soft hyphen
        if (remaining.startsWith("\u00AD")) {
            tokens.push({ type: "softHyphen" });
            remaining = remaining.slice(1);
            continue;
        }

        // Check for comet-link
        const linkMatch = remaining.match(/^\[([^\]]*)\]\(comet-link:\/\/([A-Za-z0-9+/=]+)\)/);
        if (linkMatch) {
            try {
                const linkData = decodeLinkData(linkMatch[2]);
                tokens.push({
                    type: "text",
                    text: linkMatch[1],
                    marks: [{ type: "link", attrs: { data: linkData } }],
                });
            } catch {
                // Invalid link — treat as plain text
                tokens.push({ type: "text", text: linkMatch[0] });
            }
            remaining = remaining.slice(linkMatch[0].length);
            continue;
        }

        // Check for bold: **text**
        const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
        if (boldMatch) {
            // Parse inner content for nested marks
            const innerTokens = parseInlineContent(boldMatch[1]);
            for (const token of innerTokens) {
                if (token.type === "text") {
                    tokens.push({
                        ...token,
                        marks: [...(token.marks ?? []), { type: "bold" }],
                    });
                } else {
                    tokens.push(token);
                }
            }
            remaining = remaining.slice(boldMatch[0].length);
            continue;
        }

        // Check for italic: *text*
        const italicMatch = remaining.match(/^\*([^*]+)\*/);
        if (italicMatch) {
            const innerTokens = parseInlineContent(italicMatch[1]);
            for (const token of innerTokens) {
                if (token.type === "text") {
                    tokens.push({
                        ...token,
                        marks: [...(token.marks ?? []), { type: "italic" }],
                    });
                } else {
                    tokens.push(token);
                }
            }
            remaining = remaining.slice(italicMatch[0].length);
            continue;
        }

        // Check for strikethrough: ~~text~~
        const strikeMatch = remaining.match(/^~~([^~]+)~~/);
        if (strikeMatch) {
            const innerTokens = parseInlineContent(strikeMatch[1]);
            for (const token of innerTokens) {
                if (token.type === "text") {
                    tokens.push({
                        ...token,
                        marks: [...(token.marks ?? []), { type: "strike" }],
                    });
                } else {
                    tokens.push(token);
                }
            }
            remaining = remaining.slice(strikeMatch[0].length);
            continue;
        }

        // Check for superscript: ^text^
        const supMatch = remaining.match(/^\^([^^]+)\^/);
        if (supMatch) {
            tokens.push({
                type: "text",
                text: supMatch[1],
                marks: [{ type: "superscript" }],
            });
            remaining = remaining.slice(supMatch[0].length);
            continue;
        }

        // Check for subscript: ~text~
        const subMatch = remaining.match(/^~([^~]+)~/);
        if (subMatch) {
            tokens.push({
                type: "text",
                text: subMatch[1],
                marks: [{ type: "subscript" }],
            });
            remaining = remaining.slice(subMatch[0].length);
            continue;
        }

        // Plain text - consume until next special character
        const plainMatch = remaining.match(/^[^*~^[\u00A0\u00AD\n]+/);
        if (plainMatch) {
            tokens.push({ type: "text", text: plainMatch[0] });
            remaining = remaining.slice(plainMatch[0].length);
            continue;
        }

        // Single special char that didn't match a pattern — consume one char
        tokens.push({ type: "text", text: remaining[0] });
        remaining = remaining.slice(1);
    }

    return tokens;
}

function tokensToJsonContent(tokens: InlineToken[]): JSONContent[] {
    return tokens.map((token): JSONContent => {
        switch (token.type) {
            case "nonBreakingSpace":
                return { type: "nonBreakingSpace" };
            case "softHyphen":
                return { type: "softHyphen" };
            case "hardBreak":
                return { type: "hardBreak" };
            case "text":
            default:
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return { type: "text", text: token.text, ...(token.marks && token.marks.length > 0 ? { marks: token.marks as any } : {}) };
        }
    });
}

function buildListContent(items: ParsedBlock[]): JSONContent[] {
    return items.map((item) => {
        const content = tokensToJsonContent(parseInlineContent(item.inlineContent));
        const paragraphAttrs = item.blockStyle ? { blockStyle: item.blockStyle } : undefined;
        return {
            type: "listItem",
            content: [
                {
                    type: "paragraph",
                    ...(paragraphAttrs ? { attrs: paragraphAttrs } : {}),
                    ...(content.length > 0 ? { content } : {}),
                },
            ],
        };
    });
}

/**
 * Convert comet-flavoured markdown to TipTap JSONContent
 */
export function markdownToTipTapJson(markdown: string): JSONContent {
    if (!markdown && markdown !== "") {
        return { type: "doc", content: [{ type: "paragraph" }] };
    }

    const blocks = parseBlocks(markdown);
    if (blocks.length === 0) {
        return { type: "doc", content: [{ type: "paragraph" }] };
    }

    const content: JSONContent[] = blocks.map((block): JSONContent => {
        switch (block.type) {
            case "heading": {
                const inlineContent = tokensToJsonContent(parseInlineContent(block.inlineContent));
                const attrs: Record<string, unknown> = { level: block.level };
                if (block.blockStyle) {
                    attrs.blockStyle = block.blockStyle;
                }
                return {
                    type: "heading",
                    attrs,
                    ...(inlineContent.length > 0 ? { content: inlineContent } : {}),
                };
            }

            case "bulletList":
                return {
                    type: "bulletList",
                    content: buildListContent(block.listItems ?? []),
                };

            case "orderedList":
                return {
                    type: "orderedList",
                    content: buildListContent(block.listItems ?? []),
                };

            case "paragraph":
            default: {
                const inlineContent = tokensToJsonContent(parseInlineContent(block.inlineContent));
                const attrs: Record<string, unknown> | undefined = block.blockStyle ? { blockStyle: block.blockStyle } : undefined;
                return {
                    type: "paragraph",
                    ...(attrs ? { attrs } : {}),
                    ...(inlineContent.length > 0 ? { content: inlineContent } : {}),
                };
            }
        }
    });

    return { type: "doc", content };
}

// ───────────────────────── Link Data Helpers ─────────────────────────

/**
 * Map all link data in markdown through a transformation function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapLinksInMarkdown(markdown: string, fn: (data: LinkData) => any): string {
    const re = new RegExp(COMET_LINK_RE.source, "g");
    return markdown.replace(re, (_fullMatch, text: string, encoded: string) => {
        try {
            const data = decodeLinkData(encoded);
            const newData = fn(data);
            return `[${text}](comet-link://${encodeLinkData(newData)})`;
        } catch {
            return _fullMatch;
        }
    });
}

/**
 * Async version of mapLinksInMarkdown
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function mapLinksInMarkdownAsync(markdown: string, fn: (data: LinkData) => Promise<any>): Promise<string> {
    const re = new RegExp(COMET_LINK_RE.source, "g");
    const matches: Array<{ fullMatch: string; text: string; encoded: string; index: number }> = [];
    let match: RegExpExecArray | null;
    while ((match = re.exec(markdown)) !== null) {
        matches.push({
            fullMatch: match[0],
            text: match[1],
            encoded: match[2],
            index: match.index,
        });
    }

    // Process matches in reverse order to preserve indices
    let result = markdown;
    for (let i = matches.length - 1; i >= 0; i--) {
        const m = matches[i];
        try {
            const data = decodeLinkData(m.encoded);
            const newData = await fn(data);
            const replacement = `[${m.text}](comet-link://${encodeLinkData(newData)})`;
            result = result.slice(0, m.index) + replacement + result.slice(m.index + m.fullMatch.length);
        } catch {
            // keep original
        }
    }

    return result;
}

/**
 * Map link mark data in TipTap JSONContent (sync)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapLinkMarksData(content: JSONContent, fn: (data: any) => any): JSONContent {
    if (!content || typeof content !== "object") {
        return content;
    }
    const result = { ...content };

    if (Array.isArray(result.marks)) {
        result.marks = result.marks.map((mark) => {
            if (mark.type === "link" && mark.attrs?.data) {
                return { ...mark, attrs: { ...mark.attrs, data: fn(mark.attrs.data) } };
            }
            return mark;
        });
    }

    if (Array.isArray(result.content)) {
        result.content = result.content.map((child) => mapLinkMarksData(child, fn));
    }

    return result;
}

/**
 * Map link mark data in TipTap JSONContent (async)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function mapLinkMarksDataAsync(content: JSONContent, fn: (data: any) => Promise<any>): Promise<JSONContent> {
    if (!content || typeof content !== "object") {
        return content;
    }
    const result = { ...content };

    if (Array.isArray(result.marks)) {
        result.marks = await Promise.all(
            result.marks.map(async (mark) => {
                if (mark.type === "link" && mark.attrs?.data) {
                    return { ...mark, attrs: { ...mark.attrs, data: await fn(mark.attrs.data) } };
                }
                return mark;
            }),
        );
    }

    if (Array.isArray(result.content)) {
        result.content = await Promise.all(result.content.map((child) => mapLinkMarksDataAsync(child, fn)));
    }

    return result;
}

export { decodeLinkData, encodeLinkData };
