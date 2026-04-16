import { type JSONContent } from "@tiptap/react";

/**
 * Parse a limited HTML string into TipTap JSONContent.
 *
 * Uses the browser's DOMParser to parse the HTML, then walks the DOM
 * to produce a TipTap-compatible JSON structure.
 *
 * Handles:
 * - Block elements: `<p>`, `<h1>`–`<h6>`, `<ul>`, `<ol>`, `<li>`
 * - Inline marks: `<strong>`, `<em>`, `<del>`, `<sup>`, `<sub>`
 * - Links: `<a href="comet-link://...">` (decodes JSON data from URL)
 * - Special chars: non-breaking space (`\u00a0`) → nonBreakingSpace node,
 *   soft hyphen (`\u00ad`) → softHyphen node
 * - Block styles: CSS classes on block elements → `blockStyle` attribute
 * - Line breaks: `<br>` → hardBreak node
 */
export function htmlToTipTapContent(html: string): JSONContent {
    if (!html || html.trim() === "") {
        return { type: "doc", content: [{ type: "paragraph" }] };
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const content = parseChildren(doc.body);

    if (content.length === 0) {
        return { type: "doc", content: [{ type: "paragraph" }] };
    }

    return { type: "doc", content };
}

function parseChildren(parent: Node): JSONContent[] {
    const result: JSONContent[] = [];
    for (let i = 0; i < parent.childNodes.length; i++) {
        const child = parent.childNodes[i];
        const parsed = parseNode(child);
        if (parsed) {
            if (Array.isArray(parsed)) {
                result.push(...parsed);
            } else {
                result.push(parsed);
            }
        }
    }
    return result;
}

function parseNode(node: Node): JSONContent | JSONContent[] | null {
    if (node.nodeType === Node.TEXT_NODE) {
        return parseTextNode(node as Text, []);
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
        return null;
    }

    const el = node as Element;
    const tag = el.tagName.toLowerCase();

    switch (tag) {
        case "p":
            return parseParagraph(el);
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
            return parseHeading(el);
        case "ul":
            return { type: "bulletList", content: parseListItems(el) };
        case "ol":
            return { type: "orderedList", content: parseListItems(el) };
        case "li":
            return parseListItem(el);
        default:
            return null;
    }
}

function parseParagraph(el: Element): JSONContent {
    const attrs = parseBlockStyleAttrs(el);
    const content = parseInlineChildren(el, []);
    const node: JSONContent = { type: "paragraph" };
    if (attrs) {
        node.attrs = attrs;
    }
    if (content.length > 0) {
        node.content = content;
    }
    return node;
}

function parseHeading(el: Element): JSONContent {
    const level = parseInt(el.tagName[1], 10);
    const blockStyle = getBlockStyle(el);
    const content = parseInlineChildren(el, []);
    const attrs: Record<string, unknown> = { level };
    if (blockStyle) {
        attrs.blockStyle = blockStyle;
    }
    const node: JSONContent = { type: "heading", attrs };
    if (content.length > 0) {
        node.content = content;
    }
    return node;
}

function parseListItems(el: Element): JSONContent[] {
    const items: JSONContent[] = [];
    for (let i = 0; i < el.children.length; i++) {
        const child = el.children[i];
        if (child.tagName.toLowerCase() === "li") {
            items.push(parseListItem(child));
        }
    }
    return items;
}

function parseListItem(el: Element): JSONContent {
    // In our format, <li> content maps to a listItem containing a paragraph.
    // The class on <li> becomes the paragraph's blockStyle.
    const blockStyle = getBlockStyle(el);
    const inlineContent = parseInlineChildren(el, []);
    const paragraph: JSONContent = { type: "paragraph" };
    if (blockStyle) {
        paragraph.attrs = { blockStyle };
    }
    if (inlineContent.length > 0) {
        paragraph.content = inlineContent;
    }
    return { type: "listItem", content: [paragraph] };
}

function parseBlockStyleAttrs(el: Element): Record<string, unknown> | undefined {
    const blockStyle = getBlockStyle(el);
    if (blockStyle) {
        return { blockStyle };
    }
    return undefined;
}

function getBlockStyle(el: Element): string | null {
    const className = el.getAttribute("class");
    if (className && className.trim()) {
        return className.trim();
    }
    return null;
}

interface MarkDef {
    type: string;
    attrs?: Record<string, unknown>;
}

function parseInlineChildren(parent: Node, marks: MarkDef[]): JSONContent[] {
    const result: JSONContent[] = [];
    for (let i = 0; i < parent.childNodes.length; i++) {
        const child = parent.childNodes[i];
        const parsed = parseInlineNode(child, marks);
        if (parsed) {
            result.push(...parsed);
        }
    }
    return result;
}

function parseTextNode(node: Text, marks: MarkDef[]): JSONContent[] {
    const text = node.textContent ?? "";
    if (text.length === 0) {
        return [];
    }

    return splitSpecialChars(text, marks);
}

/**
 * Splits text into segments separated by non-breaking spaces and soft hyphens,
 * creating appropriate TipTap nodes for each.
 */
function splitSpecialChars(text: string, marks: MarkDef[]): JSONContent[] {
    const result: JSONContent[] = [];
    let buffer = "";

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === "\u00a0") {
            if (buffer.length > 0) {
                result.push(makeTextNode(buffer, marks));
                buffer = "";
            }
            result.push({ type: "nonBreakingSpace" });
        } else if (char === "\u00ad") {
            if (buffer.length > 0) {
                result.push(makeTextNode(buffer, marks));
                buffer = "";
            }
            result.push({ type: "softHyphen" });
        } else {
            buffer += char;
        }
    }

    if (buffer.length > 0) {
        result.push(makeTextNode(buffer, marks));
    }

    return result;
}

function makeTextNode(text: string, marks: MarkDef[]): JSONContent {
    const node: JSONContent = { type: "text", text };
    if (marks.length > 0) {
        node.marks = marks.map((m) => ({ ...m }));
    }
    return node;
}

function parseInlineNode(node: Node, marks: MarkDef[]): JSONContent[] | null {
    if (node.nodeType === Node.TEXT_NODE) {
        return parseTextNode(node as Text, marks);
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
        return null;
    }

    const el = node as Element;
    const tag = el.tagName.toLowerCase();

    switch (tag) {
        case "strong":
        case "b":
            return parseInlineChildren(el, [...marks, { type: "bold" }]);
        case "em":
        case "i":
            return parseInlineChildren(el, [...marks, { type: "italic" }]);
        case "del":
        case "s":
            return parseInlineChildren(el, [...marks, { type: "strike" }]);
        case "sup":
            return parseInlineChildren(el, [...marks, { type: "superscript" }]);
        case "sub":
            return parseInlineChildren(el, [...marks, { type: "subscript" }]);
        case "a": {
            const linkMark = parseLinkMark(el);
            if (linkMark) {
                return parseInlineChildren(el, [...marks, linkMark]);
            }
            // If not a comet-link, treat content as plain text
            return parseInlineChildren(el, marks);
        }
        case "br":
            return [{ type: "hardBreak" }];
        default:
            // Unknown inline elements: extract their text content
            return parseInlineChildren(el, marks);
    }
}

function parseLinkMark(el: Element): MarkDef | null {
    const href = el.getAttribute("href");
    if (!href || !href.startsWith("comet-link://")) {
        return null;
    }

    try {
        const encodedData = href.slice("comet-link://".length);
        const data = JSON.parse(decodeURIComponent(encodedData));
        return { type: "link", attrs: { data } };
    } catch {
        return null;
    }
}
