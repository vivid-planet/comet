import type { JSONContent } from "@tiptap/core";

import type { Block } from "../../block";
import type { TipTapSupports } from "../createTipTapRichTextBlock";

interface DraftJsInlineStyleRange {
    style: string;
    offset: number;
    length: number;
}

interface DraftJsEntityRange {
    key: number;
    offset: number;
    length: number;
}

interface DraftJsBlock {
    key?: string;
    type: string;
    text: string;
    depth?: number;
    inlineStyleRanges?: DraftJsInlineStyleRange[];
    entityRanges?: DraftJsEntityRange[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: Record<string, any>;
}

interface DraftJsEntity {
    type: string;
    mutability?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
}

interface DraftJsContent {
    blocks: DraftJsBlock[];
    entityMap: Record<string, DraftJsEntity>;
}

interface ConvertOptions {
    supports?: TipTapSupports[];
    link?: Block;
    /**
     * Maps DraftJS block types (e.g. custom `paragraph-small`) to a TipTap paragraph
     * `blockStyle` attribute value. Matched blocks become `{ type: "paragraph", attrs: { blockStyle: ... } }`.
     */
    blockStyleMap?: Record<string, string>;
    /**
     * Maps DraftJS custom inline style names (e.g. `highlight` from a DraftJS `customInlineStyles`
     * configuration) to TipTap `inlineStyle` mark type values.
     * Matched ranges become `{ type: "inlineStyle", attrs: { type: <mappedValue> } }`.
     */
    inlineStyleMap?: Record<string, string>;
}

const INLINE_STYLE_TO_MARK: Record<string, { mark: string; supports: TipTapSupports }> = {
    BOLD: { mark: "bold", supports: "bold" },
    ITALIC: { mark: "italic", supports: "italic" },
    STRIKETHROUGH: { mark: "strike", supports: "strike" },
    SUP: { mark: "superscript", supports: "sup" },
    SUB: { mark: "subscript", supports: "sub" },
};

const HEADER_TYPE_TO_LEVEL: Record<string, number> = {
    "header-one": 1,
    "header-two": 2,
    "header-three": 3,
    "header-four": 4,
    "header-five": 5,
    "header-six": 6,
};

function makeEmptyDoc(): JSONContent {
    return { type: "doc", content: [{ type: "paragraph" }] };
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

interface InlineSegment {
    text: string;
    marks: NonNullable<JSONContent["marks"]>;
}

function buildInlineContent(
    block: DraftJsBlock,
    entityMap: Record<string, DraftJsEntity>,
    supports: Set<TipTapSupports>,
    hasLink: boolean,
    inlineStyleMap: Record<string, string>,
): JSONContent[] {
    const text = block.text ?? "";
    if (text.length === 0) {
        return [];
    }

    const splitPoints = new Set<number>([0, text.length]);

    const styleRanges = (block.inlineStyleRanges ?? []).map((range) => ({
        style: range.style,
        start: clamp(range.offset, 0, text.length),
        end: clamp(range.offset + range.length, 0, text.length),
    }));
    for (const range of styleRanges) {
        splitPoints.add(range.start);
        splitPoints.add(range.end);
    }

    const entityRanges = (block.entityRanges ?? []).map((range) => ({
        key: String(range.key),
        start: clamp(range.offset, 0, text.length),
        end: clamp(range.offset + range.length, 0, text.length),
    }));
    for (const range of entityRanges) {
        splitPoints.add(range.start);
        splitPoints.add(range.end);
    }

    const sortedPoints = Array.from(splitPoints).sort((a, b) => a - b);
    const segments: InlineSegment[] = [];

    for (let i = 0; i < sortedPoints.length - 1; i++) {
        const start = sortedPoints[i];
        const end = sortedPoints[i + 1];
        if (end <= start) {
            continue;
        }

        const segmentText = text.slice(start, end);
        if (segmentText.length === 0) {
            continue;
        }

        const marks: NonNullable<JSONContent["marks"]> = [];

        for (const range of styleRanges) {
            if (range.start <= start && range.end >= end) {
                const mapping = INLINE_STYLE_TO_MARK[range.style];
                if (mapping && supports.has(mapping.supports)) {
                    if (!marks.some((mark) => mark.type === mapping.mark)) {
                        marks.push({ type: mapping.mark });
                    }
                } else {
                    const inlineStyleType = inlineStyleMap[range.style];
                    if (inlineStyleType !== undefined) {
                        if (!marks.some((mark) => mark.type === "inlineStyle" && mark.attrs?.type === inlineStyleType)) {
                            marks.push({ type: "inlineStyle", attrs: { type: inlineStyleType } });
                        }
                    }
                }
            }
        }

        if (hasLink) {
            for (const range of entityRanges) {
                if (range.start <= start && range.end >= end) {
                    const entity = entityMap[range.key];
                    if (entity && entity.type === "LINK") {
                        marks.push({ type: "link", attrs: { data: entity.data } });
                    }
                }
            }
        }

        segments.push({ text: segmentText, marks });
    }

    return segments.flatMap((segment) => splitAtomChars(segment.text, segment.marks, supports));
}

const NBSP_CHAR = "\u00a0";
const SOFT_HYPHEN_CHAR = "\u00ad";

function makeTextNode(text: string, marks: NonNullable<JSONContent["marks"]>): JSONContent {
    const node: JSONContent = { type: "text", text };
    if (marks.length > 0) {
        node.marks = marks;
    }
    return node;
}

// Splits a text segment so each U+00A0/U+00AD character (the way the DraftJS
// RTE persists non-breaking-spaces and soft-hyphens) becomes a dedicated TipTap atom node
// when the corresponding feature is supported. Otherwise the characters are preserved as-is
// inside the surrounding text node.
function splitAtomChars(text: string, marks: NonNullable<JSONContent["marks"]>, supports: Set<TipTapSupports>): JSONContent[] {
    const supportsNbsp = supports.has("non-breaking-space");
    const supportsShy = supports.has("soft-hyphen");

    if ((!supportsNbsp && !supportsShy) || (!text.includes(NBSP_CHAR) && !text.includes(SOFT_HYPHEN_CHAR))) {
        return text.length === 0 ? [] : [makeTextNode(text, marks)];
    }

    const nodes: JSONContent[] = [];
    let buffer = "";
    const flushBuffer = () => {
        if (buffer.length > 0) {
            nodes.push(makeTextNode(buffer, marks));
            buffer = "";
        }
    };

    for (const char of text) {
        if (char === NBSP_CHAR && supportsNbsp) {
            flushBuffer();
            nodes.push({ type: "nonBreakingSpace" });
        } else if (char === SOFT_HYPHEN_CHAR && supportsShy) {
            flushBuffer();
            nodes.push({ type: "softHyphen" });
        } else {
            buffer += char;
        }
    }
    flushBuffer();
    return nodes;
}

function makeLeafBlockNode(type: "paragraph" | "heading", inlineContent: JSONContent[], headingLevel?: number): JSONContent {
    const node: JSONContent = { type };
    if (type === "heading" && headingLevel !== undefined) {
        node.attrs = { level: headingLevel };
    }
    if (inlineContent.length > 0) {
        node.content = inlineContent;
    }
    return node;
}

function makeParagraphWithBlockStyle(inlineContent: JSONContent[], blockStyle: string): JSONContent {
    const node: JSONContent = { type: "paragraph", attrs: { blockStyle } };
    if (inlineContent.length > 0) {
        node.content = inlineContent;
    }
    return node;
}

function makeListItem(inlineContent: JSONContent[]): JSONContent {
    return {
        type: "listItem",
        content: [makeLeafBlockNode("paragraph", inlineContent)],
    };
}

export function convertDraftJsToTipTap(draftContent: DraftJsContent | undefined | null, options: ConvertOptions = {}): JSONContent {
    if (!draftContent || !Array.isArray(draftContent.blocks) || draftContent.blocks.length === 0) {
        return makeEmptyDoc();
    }

    const supports = new Set<TipTapSupports>(options.supports ?? []);
    const hasLink = !!options.link;
    const blockStyleMap = options.blockStyleMap ?? {};
    const inlineStyleMap = options.inlineStyleMap ?? {};
    const entityMap = draftContent.entityMap ?? {};

    const topLevel: JSONContent[] = [];

    let currentListType: "orderedList" | "bulletList" | null = null;
    let currentListItems: JSONContent[] = [];

    const flushList = () => {
        if (currentListType && currentListItems.length > 0) {
            topLevel.push({ type: currentListType, content: currentListItems });
        }
        currentListType = null;
        currentListItems = [];
    };

    for (const block of draftContent.blocks) {
        const inlineContent = buildInlineContent(block, entityMap, supports, hasLink, inlineStyleMap);

        if (block.type === "unordered-list-item" && supports.has("unordered-list")) {
            if (currentListType !== "bulletList") {
                flushList();
                currentListType = "bulletList";
            }
            currentListItems.push(makeListItem(inlineContent));
            continue;
        }

        if (block.type === "ordered-list-item" && supports.has("ordered-list")) {
            if (currentListType !== "orderedList") {
                flushList();
                currentListType = "orderedList";
            }
            currentListItems.push(makeListItem(inlineContent));
            continue;
        }

        flushList();

        const mappedBlockStyle = blockStyleMap[block.type];
        if (mappedBlockStyle !== undefined) {
            topLevel.push(makeParagraphWithBlockStyle(inlineContent, mappedBlockStyle));
            continue;
        }

        const headerLevel = HEADER_TYPE_TO_LEVEL[block.type];
        if (headerLevel !== undefined && supports.has("heading")) {
            topLevel.push(makeLeafBlockNode("heading", inlineContent, headerLevel));
        } else {
            topLevel.push(makeLeafBlockNode("paragraph", inlineContent));
        }
    }

    flushList();

    if (topLevel.length === 0) {
        return makeEmptyDoc();
    }

    return { type: "doc", content: topLevel };
}

export function buildStrippedTipTapDoc(draftContent: DraftJsContent | undefined | null): JSONContent {
    if (!draftContent || !Array.isArray(draftContent.blocks) || draftContent.blocks.length === 0) {
        return makeEmptyDoc();
    }

    const content: JSONContent[] = draftContent.blocks.map((block) => {
        const text = block.text ?? "";
        if (text.length === 0) {
            return { type: "paragraph" };
        }
        return { type: "paragraph", content: [{ type: "text", text }] };
    });

    if (content.length === 0) {
        return makeEmptyDoc();
    }

    return { type: "doc", content };
}

export type { ConvertOptions, DraftJsContent };
