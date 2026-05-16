import { greyPalette } from "@comet/admin";
import { Box } from "@mui/material";
import { Extension } from "@tiptap/core";
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
import { CmsLink } from "./extensions/CmsLink";
import { NonBreakingSpace } from "./extensions/NonBreakingSpace";
import { SoftHyphen } from "./extensions/SoftHyphen";
import { createListLevelMaxExtension, getListNestingDepthFromJson, trimListNesting } from "./listLevelMaxHelpers";
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

export type TipTapBlockType =
    | "paragraph"
    | "heading-1"
    | "heading-2"
    | "heading-3"
    | "heading-4"
    | "heading-5"
    | "heading-6"
    | "ordered-list"
    | "unordered-list";

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
    /**
     * Limits the maximum number of top-level blocks (paragraphs, headings, lists)
     * that can be created in the editor.
     */
    maxBlocks?: number;
    /**
     * Limits the maximum nesting depth of list items.
     * A value of 1 means only a flat list (no nesting), 2 allows one level of sub-lists, etc.
     */
    listLevelMax?: number;
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

const createMaxBlocksExtension = (maxBlocks: number) =>
    Extension.create({
        name: "maxBlocks",
        addKeyboardShortcuts() {
            return {
                Enter: ({ editor }) => {
                    if (editor.state.doc.childCount >= maxBlocks) {
                        // Only block Enter when it would create a new block (not inside a list, etc.)
                        const { $from } = editor.state.selection;
                        const isAtEndOfBlock = $from.parentOffset === $from.parent.content.size;
                        const parentDepth = $from.depth;
                        // If at end of a top-level block (depth 1) or would split a top-level block
                        if (parentDepth === 1 && isAtEndOfBlock) {
                            return true; // prevent
                        }
                    }
                    return false;
                },
            };
        },
    });

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

const TipTapEditor = ({
    state,
    updateState,
    supports,
    blockStyles,
    linkBlock,
    maxBlocks,
    listLevelMax,
}: {
    state: TipTapRichTextBlockState;
    updateState: React.Dispatch<React.SetStateAction<TipTapRichTextBlockState>>;
    supports: TipTapSupports[];
    blockStyles: TipTapBlockStyle[];
    linkBlock?: BlockInterface & LinkBlockInterface;
    maxBlocks?: number;
    listLevelMax?: number;
}) => {
    const hasBlockStyles = blockStyles.length > 0;
    const hasLink = supports.includes("link") && !!linkBlock;

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
                link: false,
            }),
            ...(hasBlockStyles ? [BlockStyleParagraph] : []),
            ...(hasBlockStyles && supports.includes("heading") ? [BlockStyleHeading] : []),
            ...(supports.includes("sup") ? [Superscript] : []),
            ...(supports.includes("sub") ? [Subscript] : []),
            ...(supports.includes("non-breaking-space") ? [NonBreakingSpace] : []),
            ...(supports.includes("soft-hyphen") ? [SoftHyphen] : []),
            ...(hasLink ? [CmsLink] : []),
            ...(maxBlocks !== undefined ? [createMaxBlocksExtension(maxBlocks)] : []),
            ...(listLevelMax !== undefined ? [createListLevelMaxExtension(listLevelMax)] : []),
        ],
        content: state.tipTapContent,
        onUpdate: ({ editor }) => {
            if (maxBlocks !== undefined && editor.state.doc.childCount > maxBlocks) {
                // Remove excess blocks (e.g. from paste)
                const { tr } = editor.state;
                const doc = editor.state.doc;
                // Find the resolved position after the maxBlocks-th child
                let pos = 0;
                for (let i = 0; i < maxBlocks; i++) {
                    pos += doc.child(i).nodeSize;
                }
                // In ProseMirror, doc content positions are offset by 1 (for the doc open token)
                // Delete from after the last allowed block to end of doc content
                tr.delete(pos + 1, doc.content.size + 1);
                editor.view.dispatch(tr);
                return;
            }

            if (listLevelMax !== undefined) {
                const json = editor.getJSON();
                const currentDepth = getListNestingDepthFromJson(json);
                if (currentDepth > listLevelMax) {
                    // Trim nested lists that exceed the limit (e.g. from paste)
                    const trimmed = trimListNesting(json, listLevelMax);
                    editor.commands.setContent(trimmed);
                    return;
                }
            }

            updateState({ tipTapContent: editor.getJSON() });
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <BlockStyleContext.Provider value={blockStyles}>
            <Box sx={{ border: `1px solid ${greyPalette[100]}`, borderTopWidth: 0, backgroundColor: "white", borderRadius: "2px" }}>
                <TipTapToolbar editor={editor} supports={supports} blockStyles={blockStyles} linkBlock={linkBlock} listLevelMax={listLevelMax} />
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
    const maxBlocks = options?.maxBlocks;
    const listLevelMax = options?.listLevelMax;

    // Auto-enable link support when a link block is provided
    if (linkBlock && !supports.includes("link")) {
        supports = [...supports, "link"];
    }

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
            return { tipTapContent: content };
        },

        state2Output: ({ tipTapContent }) => {
            let content = tipTapContent;
            if (linkBlock) {
                content = mapLinkMarksData(content, (data) => linkBlock.state2Output(data));
            }
            return { tipTapContent: content };
        },

        output2State: async ({ tipTapContent }, context) => {
            let content = tipTapContent ?? emptyContent;
            if (linkBlock) {
                content = await mapLinkMarksDataAsync(content, (data) => linkBlock.output2State(data, context));
            }
            return { tipTapContent: content };
        },

        createPreviewState: ({ tipTapContent }, previewCtx) => {
            let content = tipTapContent;
            if (linkBlock) {
                content = mapLinkMarksData(content, (data) => linkBlock.createPreviewState(data, previewCtx));
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
                    maxBlocks={maxBlocks}
                    listLevelMax={listLevelMax}
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
