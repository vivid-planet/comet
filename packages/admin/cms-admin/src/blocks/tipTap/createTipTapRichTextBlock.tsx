import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { EditorContent, type JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { type ComponentType, type HTMLAttributes, type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { createBlockSkeleton } from "../helpers/createBlockSkeleton";
import { BlockCategory, type BlockInterface, type LinkBlockInterface } from "../types";
import { BlockStyleContext } from "./BlockStyleContext";
import { BlockStyleHeading } from "./extensions/BlockStyleHeading";
import { BlockStyleParagraph } from "./extensions/BlockStyleParagraph";
import { CmsLink } from "./extensions/CmsLink";
import { NonBreakingSpace } from "./extensions/NonBreakingSpace";
import { Placeholder } from "./extensions/Placeholder";
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

export interface TipTapPlaceholder {
    name: string;
    label: ReactNode;
}

export interface TipTapRichTextBlockFactoryOptions {
    supports?: TipTapSupports[];
    blockStyles?: TipTapBlockStyle[];
    placeholders?: TipTapPlaceholder[];
    link?: BlockInterface & LinkBlockInterface;
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

const TipTapEditor = ({
    state,
    updateState,
    supports,
    blockStyles,
    placeholders,
    linkBlock,
}: {
    state: TipTapRichTextBlockState;
    updateState: React.Dispatch<React.SetStateAction<TipTapRichTextBlockState>>;
    supports: TipTapSupports[];
    blockStyles: TipTapBlockStyle[];
    placeholders: TipTapPlaceholder[];
    linkBlock?: BlockInterface & LinkBlockInterface;
}) => {
    const hasBlockStyles = blockStyles.length > 0;
    const hasLink = supports.includes("link") && !!linkBlock;
    const hasPlaceholders = placeholders.length > 0;

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
            ...(hasPlaceholders ? [Placeholder] : []),
            ...(hasLink ? [CmsLink] : []),
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
            <Box sx={{ border: `1px solid ${grey[100]}`, borderTopWidth: 0, backgroundColor: "white", borderRadius: "2px" }}>
                <TipTapToolbar editor={editor} supports={supports} blockStyles={blockStyles} placeholders={placeholders} linkBlock={linkBlock} />
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
    const placeholders = options?.placeholders ?? [];
    const linkBlock = options?.link;

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
                    placeholders={placeholders}
                    linkBlock={linkBlock}
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
