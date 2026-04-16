import { parseDocument } from "htmlparser2";

import { type TipTapApiBlockStyle, type TipTapBlockType, type TipTapSupports } from "./createTipTapRichTextBlock";

interface ValidateHtmlOptions {
    supports: TipTapSupports[];
    blockStyles: TipTapApiBlockStyle[];
    hasLink: boolean;
}

interface HtmlNode {
    type: string;
    name?: string;
    attribs?: Record<string, string>;
    children?: HtmlNode[];
    data?: string; // text content
}

const headingTags = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

function headingTagToBlockType(tag: string): TipTapBlockType {
    const level = tag[1];
    return `heading-${level}` as TipTapBlockType;
}

/**
 * Strictly validate a limited HTML string for the TipTapRichTextBlock.
 *
 * Rejects any unsupported tags, attributes, or content.
 * Returns an array of error messages (empty array = valid).
 */
export function validateTipTapHtml(html: string, options: ValidateHtmlOptions): string[] {
    if (typeof html !== "string") {
        return ["tipTapContent must be a string"];
    }

    const errors: string[] = [];
    const doc = parseDocument(html);

    // The document root should only contain allowed block-level elements
    for (const child of doc.children) {
        validateBlockNode(child as HtmlNode, options, errors);
    }

    return errors;
}

function validateBlockNode(node: HtmlNode, options: ValidateHtmlOptions, errors: string[]): void {
    if (node.type === "text") {
        // Top-level text is not allowed (must be inside a block element)
        // But whitespace-only text between blocks is acceptable
        if (node.data && node.data.trim().length > 0) {
            errors.push("Text content must be inside a block element");
        }
        return;
    }

    if (node.type !== "tag") {
        errors.push(`Unsupported node type: ${node.type}`);
        return;
    }

    const tag = node.name ?? "";

    if (tag === "p") {
        validateBlockElement(node, "paragraph", options, errors);
        validateInlineChildren(node.children ?? [], options, errors);
    } else if (headingTags.has(tag)) {
        if (!options.supports.includes("heading")) {
            errors.push(`Heading element <${tag}> is not supported`);
            return;
        }
        const blockType = headingTagToBlockType(tag);
        validateBlockElement(node, blockType, options, errors);
        validateInlineChildren(node.children ?? [], options, errors);
    } else if (tag === "ul") {
        if (!options.supports.includes("unordered-list")) {
            errors.push("Unordered list <ul> is not supported");
            return;
        }
        validateListAttributes(node, errors);
        validateListChildren(node, options, errors);
    } else if (tag === "ol") {
        if (!options.supports.includes("ordered-list")) {
            errors.push("Ordered list <ol> is not supported");
            return;
        }
        validateListAttributes(node, errors);
        validateListChildren(node, options, errors);
    } else {
        errors.push(`Unsupported block element: <${tag}>`);
    }
}

function validateBlockElement(node: HtmlNode, blockType: TipTapBlockType | "paragraph", options: ValidateHtmlOptions, errors: string[]): void {
    const attribs = node.attribs ?? {};
    const allowedAttrs = new Set<string>();

    if (options.blockStyles.length > 0) {
        allowedAttrs.add("class");
    }

    for (const attr of Object.keys(attribs)) {
        if (!allowedAttrs.has(attr)) {
            errors.push(`Unsupported attribute "${attr}" on <${node.name}>`);
        }
    }

    // Validate class attribute against blockStyles
    if (attribs.class) {
        validateBlockStyleClass(attribs.class, blockType, options, errors);
    }
}

function validateBlockStyleClass(className: string, blockType: TipTapBlockType | "paragraph", options: ValidateHtmlOptions, errors: string[]): void {
    const trimmed = className.trim();
    if (!trimmed) {
        return;
    }

    // Only single class allowed
    if (trimmed.includes(" ")) {
        errors.push(`Multiple CSS classes are not allowed: "${trimmed}"`);
        return;
    }

    const matchingStyle = options.blockStyles.find((s) => s.name === trimmed);
    if (!matchingStyle) {
        errors.push(`Unknown block style: "${trimmed}"`);
        return;
    }

    // Check if the style applies to this block type
    if (matchingStyle.appliesTo && matchingStyle.appliesTo.length > 0) {
        if (!matchingStyle.appliesTo.includes(blockType as TipTapBlockType)) {
            errors.push(`Block style "${trimmed}" does not apply to ${blockType}`);
        }
    }
}

function validateListAttributes(node: HtmlNode, errors: string[]): void {
    const attribs = node.attribs ?? {};
    for (const attr of Object.keys(attribs)) {
        errors.push(`Unsupported attribute "${attr}" on <${node.name}>`);
    }
}

function validateListChildren(node: HtmlNode, options: ValidateHtmlOptions, errors: string[]): void {
    for (const child of node.children ?? []) {
        if ((child as HtmlNode).type === "text") {
            const text = (child as HtmlNode).data ?? "";
            if (text.trim().length > 0) {
                errors.push("Direct text content in <ul>/<ol> is not allowed");
            }
            continue;
        }
        if ((child as HtmlNode).type !== "tag" || (child as HtmlNode).name !== "li") {
            errors.push(`Only <li> elements are allowed inside <${node.name}>`);
            continue;
        }
        validateListItem(child as HtmlNode, options, errors);
    }
}

function validateListItem(node: HtmlNode, options: ValidateHtmlOptions, errors: string[]): void {
    const attribs = node.attribs ?? {};
    const allowedAttrs = new Set<string>();

    if (options.blockStyles.length > 0) {
        allowedAttrs.add("class");
    }

    for (const attr of Object.keys(attribs)) {
        if (!allowedAttrs.has(attr)) {
            errors.push(`Unsupported attribute "${attr}" on <li>`);
        }
    }

    // Validate class attribute against blockStyles (list items use paragraph styles)
    if (attribs.class) {
        validateBlockStyleClass(attribs.class, "paragraph", options, errors);
    }

    validateInlineChildren(node.children ?? [], options, errors);
}

function validateInlineChildren(children: HtmlNode[], options: ValidateHtmlOptions, errors: string[]): void {
    for (const child of children) {
        validateInlineNode(child, options, errors);
    }
}

function validateInlineNode(node: HtmlNode, options: ValidateHtmlOptions, errors: string[]): void {
    if (node.type === "text") {
        // Text nodes are always allowed inside inline context
        return;
    }

    if (node.type !== "tag") {
        errors.push(`Unsupported inline node type: ${node.type}`);
        return;
    }

    const tag = node.name ?? "";

    switch (tag) {
        case "strong":
        case "b":
            if (!options.supports.includes("bold")) {
                errors.push(`Bold (<${tag}>) is not supported`);
                return;
            }
            validateNoAttributes(node, errors);
            validateInlineChildren(node.children ?? [], options, errors);
            break;

        case "em":
        case "i":
            if (!options.supports.includes("italic")) {
                errors.push(`Italic (<${tag}>) is not supported`);
                return;
            }
            validateNoAttributes(node, errors);
            validateInlineChildren(node.children ?? [], options, errors);
            break;

        case "del":
        case "s":
            if (!options.supports.includes("strike")) {
                errors.push(`Strikethrough (<${tag}>) is not supported`);
                return;
            }
            validateNoAttributes(node, errors);
            validateInlineChildren(node.children ?? [], options, errors);
            break;

        case "sup":
            if (!options.supports.includes("sup")) {
                errors.push("Superscript (<sup>) is not supported");
                return;
            }
            validateNoAttributes(node, errors);
            validateInlineChildren(node.children ?? [], options, errors);
            break;

        case "sub":
            if (!options.supports.includes("sub")) {
                errors.push("Subscript (<sub>) is not supported");
                return;
            }
            validateNoAttributes(node, errors);
            validateInlineChildren(node.children ?? [], options, errors);
            break;

        case "a":
            validateLinkElement(node, options, errors);
            break;

        case "br":
            validateNoAttributes(node, errors);
            break;

        default:
            errors.push(`Unsupported inline element: <${tag}>`);
    }
}

function validateNoAttributes(node: HtmlNode, errors: string[]): void {
    const attribs = node.attribs ?? {};
    for (const attr of Object.keys(attribs)) {
        errors.push(`Unsupported attribute "${attr}" on <${node.name}>`);
    }
}

function validateLinkElement(node: HtmlNode, options: ValidateHtmlOptions, errors: string[]): void {
    if (!options.hasLink) {
        errors.push("Links (<a>) are not supported");
        return;
    }

    const attribs = node.attribs ?? {};

    // Only href attribute is allowed
    for (const attr of Object.keys(attribs)) {
        if (attr !== "href") {
            errors.push(`Unsupported attribute "${attr}" on <a>`);
        }
    }

    const href = attribs.href;
    if (!href) {
        errors.push("Link element <a> must have an href attribute");
        return;
    }

    if (!href.startsWith("comet-link://")) {
        errors.push(`Invalid link href: must start with "comet-link://", got "${href}"`);
        return;
    }

    // Validate the encoded JSON data
    try {
        const encoded = href.slice("comet-link://".length);
        JSON.parse(decodeURIComponent(encoded));
    } catch {
        errors.push("Invalid link data: could not decode JSON from href");
    }

    // Validate inline children of the link
    validateInlineChildren(node.children ?? [], options, errors);
}

// --- Utility functions for text extraction and link collection ---

interface TextEntry {
    text: string;
    headingLevel?: number;
}

/**
 * Extract text entries from HTML with heading level information for search indexing.
 */
export function extractTextEntriesFromHtml(html: string): TextEntry[] {
    if (typeof html !== "string" || !html.trim()) {
        return [];
    }

    const doc = parseDocument(html);
    const entries: TextEntry[] = [];
    extractTextFromNodes(doc.children as HtmlNode[], undefined, entries);
    return entries;
}

function extractTextFromNodes(nodes: HtmlNode[], headingLevel: number | undefined, entries: TextEntry[]): void {
    for (const node of nodes) {
        if (node.type === "text") {
            const text = node.data ?? "";
            if (text.length > 0) {
                // Replace &nbsp; (\u00a0) and &shy; (\u00ad) for clean text extraction
                const cleanText = text.replace(/\u00a0/g, " ").replace(/\u00ad/g, "");
                if (cleanText.length > 0) {
                    entries.push({ text: cleanText, headingLevel });
                }
            }
            return;
        }

        if (node.type !== "tag") {
            return;
        }

        const tag = node.name ?? "";
        let currentHeadingLevel = headingLevel;

        if (headingTags.has(tag)) {
            currentHeadingLevel = parseInt(tag[1], 10);
        }

        extractTextFromNodes(node.children ?? [], currentHeadingLevel, entries);
    }
}

interface LinkEntry {
    data: unknown;
    path: string; // simplified path for identification
}

/**
 * Collect all comet-link:// link data from HTML.
 */
export function collectLinksFromHtml(html: string): LinkEntry[] {
    if (typeof html !== "string" || !html.trim()) {
        return [];
    }

    const doc = parseDocument(html);
    const links: LinkEntry[] = [];
    let linkIndex = 0;
    collectLinksFromNodes(doc.children as HtmlNode[], links, () => linkIndex++);
    return links;
}

function collectLinksFromNodes(nodes: HtmlNode[], links: LinkEntry[], nextIndex: () => number): void {
    for (const node of nodes) {
        if (node.type !== "tag") {
            continue;
        }

        if (node.name === "a" && node.attribs?.href?.startsWith("comet-link://")) {
            try {
                const encoded = node.attribs.href.slice("comet-link://".length);
                const data = JSON.parse(decodeURIComponent(encoded));
                const idx = nextIndex();
                links.push({ data, path: `links[${idx}]` });
            } catch {
                // Skip invalid links
            }
        }

        if (node.children) {
            collectLinksFromNodes(node.children as HtmlNode[], links, nextIndex);
        }
    }
}

/**
 * Replace link data in HTML by transforming each comet-link:// href.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapLinksInHtml(html: string, fn: (data: any) => any): string {
    if (typeof html !== "string" || !html.trim()) {
        return html;
    }

    return html.replace(/comet-link:\/\/([^"]*)/g, (_match, encoded) => {
        try {
            const data = JSON.parse(decodeURIComponent(encoded));
            const transformed = fn(data);
            return `comet-link://${encodeURIComponent(JSON.stringify(transformed))}`;
        } catch {
            return _match;
        }
    });
}

/**
 * Async version of mapLinksInHtml.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function mapLinksInHtmlAsync(html: string, fn: (data: any) => Promise<any>): Promise<string> {
    if (typeof html !== "string" || !html.trim()) {
        return html;
    }

    const regex = /comet-link:\/\/([^"]*)/g;
    const parts: (string | Promise<string>)[] = [];
    let lastIndex = 0;

    let match;
    while ((match = regex.exec(html)) !== null) {
        parts.push(html.slice(lastIndex, match.index));
        const encoded = match[1];
        parts.push(
            (async () => {
                try {
                    const data = JSON.parse(decodeURIComponent(encoded));
                    const transformed = await fn(data);
                    return `comet-link://${encodeURIComponent(JSON.stringify(transformed))}`;
                } catch {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    return match![0];
                }
            })(),
        );
        lastIndex = match.index + match[0].length;
    }

    parts.push(html.slice(lastIndex));

    const resolved = await Promise.all(parts);
    return resolved.join("");
}
