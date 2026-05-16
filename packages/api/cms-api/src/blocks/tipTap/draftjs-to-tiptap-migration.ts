import { type Extensions, getSchema } from "@tiptap/core";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { Node as ProseMirrorNode, type Schema } from "@tiptap/pm/model";
import StarterKit from "@tiptap/starter-kit";

import { BlockMigration } from "../migrations/BlockMigration";
import type { BlockMigrationInterface } from "../migrations/types";
import type { CreateTipTapRichTextBlockOptions } from "./createTipTapRichTextBlock";
import { BlockStyleHeading } from "./extensions/BlockStyleHeading";
import { BlockStyleParagraph } from "./extensions/BlockStyleParagraph";
import { CmsLink } from "./extensions/CmsLink";
import { NonBreakingSpace } from "./extensions/NonBreakingSpace";
import { SoftHyphen } from "./extensions/SoftHyphen";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TipTapContent = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TipTapMark = Record<string, any>;

interface DraftInlineStyleRange {
    style: string;
    offset: number;
    length: number;
}

interface DraftEntityRange {
    offset: number;
    length: number;
    key: number;
}

interface DraftBlock {
    key: string;
    type: string;
    text: string;
    depth: number;
    inlineStyleRanges: DraftInlineStyleRange[];
    entityRanges: DraftEntityRange[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: Record<string, any>;
}

interface DraftEntity {
    type: string;
    mutability: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}

interface DraftContentState {
    blocks: DraftBlock[];
    entityMap: Record<string, DraftEntity>;
}

interface DraftJsBlockData {
    draftContent: DraftContentState;
}

interface TipTapBlockData {
    tipTapContent: TipTapContent;
}

type TipTapSupports =
    | "bold"
    | "italic"
    | "strike"
    | "sub"
    | "sup"
    | "heading"
    | "ordered-list"
    | "unordered-list"
    | "non-breaking-space"
    | "soft-hyphen"
    | "link";

const defaultSupports: TipTapSupports[] = [
    "bold",
    "italic",
    "strike",
    "sub",
    "sup",
    "heading",
    "ordered-list",
    "unordered-list",
    "non-breaking-space",
    "soft-hyphen",
];

const draftStyleToTipTapMark: Record<string, string> = {
    BOLD: "bold",
    ITALIC: "italic",
    STRIKETHROUGH: "strike",
    SUP: "superscript",
    SUB: "subscript",
};

const draftBlockTypeToHeadingLevel: Record<string, number> = {
    "header-one": 1,
    "header-two": 2,
    "header-three": 3,
    "header-four": 4,
    "header-five": 5,
    "header-six": 6,
};

function buildExtensions(supports: TipTapSupports[], hasLink: boolean): Extensions {
    return [
        StarterKit.configure({
            bold: supports.includes("bold") ? {} : false,
            italic: supports.includes("italic") ? {} : false,
            strike: supports.includes("strike") ? {} : false,
            heading: supports.includes("heading") ? {} : false,
            orderedList: supports.includes("ordered-list") ? {} : false,
            bulletList: supports.includes("unordered-list") ? {} : false,
            blockquote: false,
            code: false,
            codeBlock: false,
            link: false,
        }),
        ...(supports.includes("sup") ? [Superscript] : []),
        ...(supports.includes("sub") ? [Subscript] : []),
        ...(supports.includes("non-breaking-space") ? [NonBreakingSpace] : []),
        ...(supports.includes("soft-hyphen") ? [SoftHyphen] : []),
        ...(hasLink ? [CmsLink] : []),
    ];
}

function buildSchemaForValidation(supports: TipTapSupports[], blockStyles: Array<{ name: string }>, hasLink: boolean): Schema {
    if (blockStyles.length > 0) {
        const extensions: Extensions = [
            StarterKit.configure({
                bold: supports.includes("bold") ? {} : false,
                italic: supports.includes("italic") ? {} : false,
                strike: supports.includes("strike") ? {} : false,
                heading: supports.includes("heading") ? false : false,
                paragraph: false,
                orderedList: supports.includes("ordered-list") ? {} : false,
                bulletList: supports.includes("unordered-list") ? {} : false,
                blockquote: false,
                code: false,
                codeBlock: false,
                link: false,
            }),
            BlockStyleParagraph,
            ...(supports.includes("heading") ? [BlockStyleHeading] : []),
            ...(supports.includes("sup") ? [Superscript] : []),
            ...(supports.includes("sub") ? [Subscript] : []),
            ...(supports.includes("non-breaking-space") ? [NonBreakingSpace] : []),
            ...(supports.includes("soft-hyphen") ? [SoftHyphen] : []),
            ...(hasLink ? [CmsLink] : []),
        ];
        return getSchema(extensions);
    }
    return getSchema(buildExtensions(supports, hasLink));
}

interface StyleSegment {
    text: string;
    marks: TipTapMark[];
}

function convertInlineStylesToMarks(
    text: string,
    inlineStyleRanges: DraftInlineStyleRange[],
    entityRanges: DraftEntityRange[],
    entityMap: Record<string, DraftEntity>,
    supports: TipTapSupports[],
    hasLink: boolean,
): TipTapContent[] {
    if (text.length === 0) {
        return [];
    }

    // Collect all boundary points
    const boundaries = new Set<number>();
    boundaries.add(0);
    boundaries.add(text.length);

    for (const range of inlineStyleRanges) {
        boundaries.add(range.offset);
        boundaries.add(range.offset + range.length);
    }
    for (const range of entityRanges) {
        boundaries.add(range.offset);
        boundaries.add(range.offset + range.length);
    }

    const sortedBoundaries = Array.from(boundaries).sort((a, b) => a - b);

    const segments: StyleSegment[] = [];
    for (let i = 0; i < sortedBoundaries.length - 1; i++) {
        const start = sortedBoundaries[i];
        const end = sortedBoundaries[i + 1];
        const segmentText = text.substring(start, end);

        if (segmentText.length === 0) {
            continue;
        }

        const marks: TipTapMark[] = [];

        // Collect inline style marks
        for (const range of inlineStyleRanges) {
            const rangeEnd = range.offset + range.length;
            if (range.offset <= start && rangeEnd >= end) {
                const tipTapMarkType = draftStyleToTipTapMark[range.style];
                if (tipTapMarkType) {
                    // Check if this mark is supported
                    const supportKey = markTypeToSupportKey(tipTapMarkType);
                    if (supportKey && supports.includes(supportKey)) {
                        marks.push({ type: tipTapMarkType });
                    }
                }
            }
        }

        // Collect entity marks (links)
        for (const range of entityRanges) {
            const rangeEnd = range.offset + range.length;
            if (range.offset <= start && rangeEnd >= end) {
                const entity = entityMap[String(range.key)];
                if (entity && entity.type === "LINK" && hasLink) {
                    marks.push({
                        type: "link",
                        attrs: { data: entity.data },
                    });
                }
            }
        }

        segments.push({ text: segmentText, marks });
    }

    // Merge adjacent segments with identical marks
    const merged: StyleSegment[] = [];
    for (const segment of segments) {
        const last = merged[merged.length - 1];
        if (last && marksEqual(last.marks, segment.marks)) {
            last.text += segment.text;
        } else {
            merged.push({ ...segment });
        }
    }

    return merged.map((segment) => {
        const node: TipTapContent = { type: "text", text: segment.text };
        if (segment.marks.length > 0) {
            node.marks = segment.marks;
        }
        return node;
    });
}

function markTypeToSupportKey(markType: string): TipTapSupports | undefined {
    switch (markType) {
        case "bold":
            return "bold";
        case "italic":
            return "italic";
        case "strike":
            return "strike";
        case "superscript":
            return "sup";
        case "subscript":
            return "sub";
        default:
            return undefined;
    }
}

function marksEqual(a: TipTapMark[], b: TipTapMark[]): boolean {
    if (a.length !== b.length) {
        return false;
    }
    return JSON.stringify(a) === JSON.stringify(b);
}

function convertDraftBlockToTipTapNode(
    block: DraftBlock,
    entityMap: Record<string, DraftEntity>,
    supports: TipTapSupports[],
    hasLink: boolean,
): TipTapContent | null {
    const content = convertInlineStylesToMarks(block.text, block.inlineStyleRanges, block.entityRanges, entityMap, supports, hasLink);

    const headingLevel = draftBlockTypeToHeadingLevel[block.type];
    if (headingLevel) {
        if (!supports.includes("heading")) {
            // Fall back to paragraph if headings not supported
            return { type: "paragraph", ...(content.length > 0 ? { content } : {}) };
        }
        return {
            type: "heading",
            attrs: { level: headingLevel },
            ...(content.length > 0 ? { content } : {}),
        };
    }

    if (block.type === "unstyled" || block.type === "atomic") {
        return { type: "paragraph", ...(content.length > 0 ? { content } : {}) };
    }

    // List items are handled separately
    if (block.type === "ordered-list-item" || block.type === "unordered-list-item") {
        return {
            type: "listItem",
            content: [{ type: "paragraph", ...(content.length > 0 ? { content } : {}) }],
        };
    }

    // Unknown block types fall back to paragraph
    return { type: "paragraph", ...(content.length > 0 ? { content } : {}) };
}

function groupListItems(nodes: Array<{ node: TipTapContent; draftType: string }>, supports: TipTapSupports[]): TipTapContent[] {
    const result: TipTapContent[] = [];
    let currentListType: string | null = null;
    let currentListItems: TipTapContent[] = [];

    function flushList() {
        if (currentListItems.length > 0 && currentListType) {
            const listNodeType = currentListType === "ordered-list-item" ? "orderedList" : "bulletList";
            const supportKey: TipTapSupports = currentListType === "ordered-list-item" ? "ordered-list" : "unordered-list";

            if (supports.includes(supportKey)) {
                result.push({ type: listNodeType, content: currentListItems });
            } else {
                // If lists not supported, extract list item content as paragraphs
                for (const item of currentListItems) {
                    if (item.content && Array.isArray(item.content)) {
                        for (const child of item.content) {
                            result.push(child);
                        }
                    }
                }
            }
            currentListItems = [];
            currentListType = null;
        }
    }

    for (const { node, draftType } of nodes) {
        const isListItem = draftType === "ordered-list-item" || draftType === "unordered-list-item";

        if (isListItem) {
            if (currentListType !== draftType) {
                flushList();
                currentListType = draftType;
            }
            currentListItems.push(node);
        } else {
            flushList();
            result.push(node);
        }
    }

    flushList();
    return result;
}

function isDraftJsData(data: unknown): data is DraftJsBlockData {
    if (typeof data !== "object" || data === null) {
        return false;
    }
    if (!("draftContent" in data)) {
        return false;
    }
    const dc = (data as DraftJsBlockData).draftContent;
    return typeof dc === "object" && dc !== null && Array.isArray(dc.blocks) && typeof dc.entityMap === "object" && dc.entityMap !== null;
}

function extractPlainText(draftContent: DraftContentState): string {
    return draftContent.blocks.map((b) => b.text).join("\n");
}

function createFallbackContent(draftContent: DraftContentState): TipTapContent {
    const paragraphs: TipTapContent[] = [];

    for (const block of draftContent.blocks) {
        if (block.text.trim().length > 0) {
            paragraphs.push({
                type: "paragraph",
                content: [{ type: "text", text: block.text }],
            });
        }
    }

    if (paragraphs.length === 0) {
        paragraphs.push({ type: "paragraph" });
    }

    return { type: "doc", content: paragraphs };
}

function validateTipTapContent(content: TipTapContent, schema: Schema): boolean {
    try {
        const node = ProseMirrorNode.fromJSON(schema, content);
        node.check();
        return true;
    } catch {
        return false;
    }
}

function convertDraftJsToTipTap(draftContent: DraftContentState, supports: TipTapSupports[], hasLink: boolean): TipTapContent {
    if (!draftContent.blocks || draftContent.blocks.length === 0) {
        return { type: "doc", content: [{ type: "paragraph" }] };
    }

    const nodesWithType: Array<{ node: TipTapContent; draftType: string }> = [];

    for (const block of draftContent.blocks) {
        const node = convertDraftBlockToTipTapNode(block, draftContent.entityMap, supports, hasLink);
        if (node) {
            nodesWithType.push({ node, draftType: block.type });
        }
    }

    if (nodesWithType.length === 0) {
        return { type: "doc", content: [{ type: "paragraph" }] };
    }

    const content = groupListItems(nodesWithType, supports);

    return { type: "doc", content };
}

type CreateDraftJsToTipTapMigrationOptions = Pick<CreateTipTapRichTextBlockOptions, "supports" | "blockStyles" | "link">;

export function createDraftJsToTipTapMigration(options: CreateDraftJsToTipTapMigrationOptions = {}): new () => BlockMigrationInterface {
    const supports: TipTapSupports[] = (options.supports ?? defaultSupports) as TipTapSupports[];
    const blockStyles = options.blockStyles ?? [];
    const hasLink = !!options.link;
    const schema = buildSchemaForValidation(supports, blockStyles, hasLink);

    class DraftJsToTipTapMigration extends BlockMigration<(from: DraftJsBlockData) => TipTapBlockData> implements BlockMigrationInterface {
        public readonly toVersion = 1;

        public supports(raw: DraftJsBlockData & { $$version?: number }): boolean {
            // Support version 0/undefined AND must have draftContent
            if (!super.supports(raw)) {
                return false;
            }
            return isDraftJsData(raw);
        }

        protected migrate(raw: DraftJsBlockData): TipTapBlockData {
            const { draftContent } = raw;

            const tipTapContent = convertDraftJsToTipTap(draftContent, supports, hasLink);

            if (validateTipTapContent(tipTapContent, schema)) {
                return { tipTapContent };
            }

            // Validation failed, try fallback with plain text only
            const fallbackContent = createFallbackContent(draftContent);

            if (validateTipTapContent(fallbackContent, schema)) {
                return { tipTapContent: fallbackContent };
            }

            // Last resort: empty document
            return { tipTapContent: { type: "doc", content: [{ type: "paragraph" }] } };
        }
    }

    return DraftJsToTipTapMigration;
}

// Exported for testing
export {
    convertDraftJsToTipTap,
    createFallbackContent,
    type DraftBlock,
    type DraftContentState,
    type DraftEntity,
    type DraftJsBlockData,
    extractPlainText,
    isDraftJsData,
    type TipTapBlockData,
};
