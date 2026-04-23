import { greyPalette } from "@comet/admin";
import { Box } from "@mui/material";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { EditorContent, type JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { ComponentType, HTMLAttributes, ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { createBlockSkeleton } from "../helpers/createBlockSkeleton";
import { BlockCategory, type BlockInterface, type LinkBlockInterface } from "../types";
import { BlockStyleContext } from "./BlockStyleContext";
import { BlockStyleHeading } from "./extensions/BlockStyleHeading";
import { BlockStyleParagraph } from "./extensions/BlockStyleParagraph";
import { ChildBlock } from "./extensions/ChildBlock";
import { CmsLink } from "./extensions/CmsLink";
import { NonBreakingSpace } from "./extensions/NonBreakingSpace";
import { SoftHyphen } from "./extensions/SoftHyphen";
import { TipTapToolbar } from "./TipTapToolbar";

export type TipTapSupports =
    | "history"
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
    "history",
    "heading",
    "bold",
    "italic",
    "strike",
    "sub",
    "sup",
    "ordered-list",
    "unordered-list",
    "non-breaking-space",
    "soft-hyphen",
];

export type TipTapBlockType = "paragraph" | "heading-1" | "heading-2" | "heading-3" | "heading-4" | "heading-5" | "heading-6";

export interface TipTapBlockStyle {
    name: string;
    label: ReactNode;
    /**
     * Limits the block style to the provided block types.
     * If none is specified, the block style is allowed for all block types.
     */
    appliesTo?: TipTapBlockType[];
    element: ComponentType<HTMLAttributes<HTMLElement>>;
}

export interface TipTapRichTextBlockState {
    tipTapContent: JSONContent;
}

interface TipTapRichTextBlockData {
    tipTapContent: JSONContent;
}

interface TipTapRichTextBlockInput {
    tipTapContent: JSONContent;
}

interface TipTapRichTextBlockFactoryOptions {
    supports?: TipTapSupports[];
    blockStyles?: TipTapBlockStyle[];
    link?: BlockInterface & LinkBlockInterface;
    childBlocks?: BlockInterface[];
}

function getPlainTextFromContent(content: JSONContent): string {
    let text = "";
    if (content.text) {
        text += content.text;
    }
    if (content.content) {
        for (const child of content.content) {
            text += getPlainTextFromContent(child);
        }
    }
    return text;
}

const emptyContent: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapLinkMarksData(content: JSONContent, fn: (data: any) => any): JSONContent {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function mapLinkMarksDataAsync(content: JSONContent, fn: (data: any) => Promise<any>): Promise<JSONContent> {
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

function mapChildBlockNodesData(
    content: JSONContent,
    childBlocksMap: Map<string, BlockInterface>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fn: (block: BlockInterface, data: any) => any,
): JSONContent {
    if (!content || typeof content !== "object") {
        return content;
    }
    const result = { ...content };

    if (result.type === "childBlock" && result.attrs?.type && result.attrs?.data) {
        const block = childBlocksMap.get(result.attrs.type as string);
        if (block) {
            result.attrs = { ...result.attrs, data: fn(block, result.attrs.data) };
        }
    }

    if (Array.isArray(result.content)) {
        result.content = result.content.map((child) => mapChildBlockNodesData(child, childBlocksMap, fn));
    }

    return result;
}

async function mapChildBlockNodesDataAsync(
    content: JSONContent,
    childBlocksMap: Map<string, BlockInterface>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fn: (block: BlockInterface, data: any) => Promise<any>,
): Promise<JSONContent> {
    if (!content || typeof content !== "object") {
        return content;
    }
    const result = { ...content };

    if (result.type === "childBlock" && result.attrs?.type && result.attrs?.data) {
        const block = childBlocksMap.get(result.attrs.type as string);
        if (block) {
            result.attrs = { ...result.attrs, data: await fn(block, result.attrs.data) };
        }
    }

    if (Array.isArray(result.content)) {
        result.content = await Promise.all(result.content.map((child) => mapChildBlockNodesDataAsync(child, childBlocksMap, fn)));
    }

    return result;
}

const TipTapEditor = ({
    state,
    updateState,
    supports,
    blockStyles,
    linkBlock,
    childBlocks,
}: {
    state: TipTapRichTextBlockState;
    updateState: React.Dispatch<React.SetStateAction<TipTapRichTextBlockState>>;
    supports: TipTapSupports[];
    blockStyles: TipTapBlockStyle[];
    linkBlock?: BlockInterface & LinkBlockInterface;
    childBlocks: BlockInterface[];
}) => {
    const hasBlockStyles = blockStyles.length > 0;
    const hasLink = supports.includes("link") && !!linkBlock;
    const hasChildBlocks = childBlocks.length > 0;

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bold: supports.includes("bold") ? {} : false,
                italic: supports.includes("italic") ? {} : false,
                strike: supports.includes("strike") ? {} : false,
                heading: supports.includes("heading") ? (hasBlockStyles ? false : {}) : false,
                paragraph: hasBlockStyles ? false : undefined,
                orderedList: supports.includes("ordered-list") ? {} : false,
                bulletList: supports.includes("unordered-list") ? {} : false,
                blockquote: false,
                code: false,
                codeBlock: false,
            }),
            ...(hasBlockStyles ? [BlockStyleParagraph] : []),
            ...(hasBlockStyles && supports.includes("heading") ? [BlockStyleHeading] : []),
            ...(supports.includes("sup") ? [Superscript] : []),
            ...(supports.includes("sub") ? [Subscript] : []),
            ...(supports.includes("non-breaking-space") ? [NonBreakingSpace] : []),
            ...(supports.includes("soft-hyphen") ? [SoftHyphen] : []),
            ...(hasLink ? [CmsLink] : []),
            ...(hasChildBlocks ? [ChildBlock] : []),
        ],
        content: state.tipTapContent,
        onUpdate: ({ editor }) => {
            updateState({ tipTapContent: editor.getJSON() });
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <BlockStyleContext.Provider value={blockStyles}>
            <Box sx={{ border: `1px solid ${greyPalette[100]}`, borderTopWidth: 0, backgroundColor: "white", borderRadius: "2px" }}>
                <TipTapToolbar editor={editor} supports={supports} blockStyles={blockStyles} linkBlock={linkBlock} childBlocks={childBlocks} />
                <Box sx={{ "& .tiptap": { minHeight: 200, p: "20px", outline: "none" } }}>
                    <EditorContent editor={editor} />
                </Box>
            </Box>
        </BlockStyleContext.Provider>
    );
};

/**
 * @experimental
 */
export const createTipTapRichTextBlock = (
    options?: TipTapRichTextBlockFactoryOptions,
): BlockInterface<TipTapRichTextBlockData, TipTapRichTextBlockState, TipTapRichTextBlockInput> => {
    let supports = options?.supports ?? defaultSupports;
    const blockStyles = options?.blockStyles ?? [];
    const linkBlock = options?.link;
    const childBlocks = options?.childBlocks ?? [];

    // Auto-enable link support when a link block is provided
    if (linkBlock && !supports.includes("link")) {
        supports = [...supports, "link"];
    }

    // Build a map of child blocks by name for efficient lookup
    const childBlocksMap = new Map<string, BlockInterface>(childBlocks.map((b) => [b.name, b]));

    const TipTapRichTextBlock: BlockInterface<TipTapRichTextBlockData, TipTapRichTextBlockState, TipTapRichTextBlockInput> = {
        ...createBlockSkeleton(),

        name: "TipTapRichText",

        displayName: <FormattedMessage id="comet.blocks.tipTapRichText" defaultMessage="Rich Text (TipTap)" />,

        defaultValues: () => ({ tipTapContent: emptyContent }),

        category: BlockCategory.TextAndContent,

        input2State: ({ tipTapContent }) => {
            let content = tipTapContent ?? emptyContent;
            if (linkBlock) {
                content = mapLinkMarksData(content, (data) => linkBlock.input2State(data));
            }
            if (childBlocksMap.size > 0) {
                content = mapChildBlockNodesData(content, childBlocksMap, (block, data) => block.input2State(data));
            }
            return { tipTapContent: content };
        },

        state2Output: ({ tipTapContent }) => {
            let content = tipTapContent;
            if (linkBlock) {
                content = mapLinkMarksData(content, (data) => linkBlock.state2Output(data));
            }
            if (childBlocksMap.size > 0) {
                content = mapChildBlockNodesData(content, childBlocksMap, (block, data) => block.state2Output(data));
            }
            return { tipTapContent: content };
        },

        output2State: async ({ tipTapContent }, context) => {
            let content = tipTapContent ?? emptyContent;
            if (linkBlock) {
                content = await mapLinkMarksDataAsync(content, (data) => linkBlock.output2State(data, context));
            }
            if (childBlocksMap.size > 0) {
                content = await mapChildBlockNodesDataAsync(content, childBlocksMap, (block, data) => block.output2State(data, context));
            }
            return { tipTapContent: content };
        },

        createPreviewState: ({ tipTapContent }, previewCtx) => {
            let content = tipTapContent;
            if (linkBlock) {
                content = mapLinkMarksData(content, (data) => linkBlock.createPreviewState(data, previewCtx));
            }
            if (childBlocksMap.size > 0) {
                content = mapChildBlockNodesData(content, childBlocksMap, (block, data) => block.createPreviewState(data, previewCtx));
            }
            return {
                tipTapContent: content,
                adminMeta: { route: previewCtx.parentUrl },
            };
        },

        AdminComponent: ({ state, updateState }) => {
            return (
                <TipTapEditor
                    state={state}
                    updateState={updateState}
                    supports={supports}
                    blockStyles={blockStyles}
                    linkBlock={linkBlock}
                    childBlocks={childBlocks}
                />
            );
        },

        previewContent: (state) => {
            const text = getPlainTextFromContent(state.tipTapContent);
            const MAX_CHARS = 100;
            return text.length > 0 ? [{ type: "text", content: text.slice(0, MAX_CHARS) }] : [];
        },

        extractTextContents: (state) => {
            const text = getPlainTextFromContent(state.tipTapContent);
            return text.length > 0 ? [text] : [];
        },
    };

    return TipTapRichTextBlock;
};
