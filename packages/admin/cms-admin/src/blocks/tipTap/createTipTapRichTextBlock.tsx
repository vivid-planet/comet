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
import { SoftHyphen } from "./extensions/SoftHyphen";
import { mapLinkMarksData, mapLinksInMarkdownAsync, markdownToTipTapJson, tipTapJsonToMarkdown } from "./markdownConverters";
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
    markdown: string;
}

interface TipTapRichTextBlockInput {
    markdown: string;
}

export interface TipTapRichTextBlockFactoryOptions {
    supports?: TipTapSupports[];
    blockStyles?: TipTapBlockStyle[];
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

const TipTapEditor = ({
    state,
    updateState,
    supports,
    blockStyles,
    linkBlock,
}: {
    state: TipTapRichTextBlockState;
    updateState: React.Dispatch<React.SetStateAction<TipTapRichTextBlockState>>;
    supports: TipTapSupports[];
    blockStyles: TipTapBlockStyle[];
    linkBlock?: BlockInterface & LinkBlockInterface;
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
            }),
            ...(hasBlockStyles ? [BlockStyleParagraph] : []),
            ...(hasBlockStyles && supports.includes("heading") ? [BlockStyleHeading] : []),
            ...(supports.includes("sup") ? [Superscript] : []),
            ...(supports.includes("sub") ? [Subscript] : []),
            ...(supports.includes("non-breaking-space") ? [NonBreakingSpace] : []),
            ...(supports.includes("soft-hyphen") ? [SoftHyphen] : []),
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
                <TipTapToolbar editor={editor} supports={supports} blockStyles={blockStyles} linkBlock={linkBlock} />
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

        input2State: ({ markdown }) => {
            let content = markdown ? markdownToTipTapJson(markdown) : emptyContent;
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
            const markdown = tipTapJsonToMarkdown(content);
            return { markdown };
        },

        output2State: async ({ markdown }, context) => {
            if (!markdown) {
                return { tipTapContent: emptyContent };
            }
            // First map link data in the markdown before converting to JSON
            let md = markdown;
            if (linkBlock) {
                md = await mapLinksInMarkdownAsync(md, (data) => linkBlock.output2State(data, context));
            }
            const content = markdownToTipTapJson(md);
            return { tipTapContent: content };
        },

        createPreviewState: ({ tipTapContent }, previewCtx) => {
            let content = tipTapContent;
            if (linkBlock) {
                content = mapLinkMarksData(content, (data) => linkBlock.createPreviewState(data, previewCtx));
            }
            const markdown = tipTapJsonToMarkdown(content);
            return {
                markdown,
                adminMeta: { route: previewCtx.parentUrl },
            };
        },

        AdminComponent: ({ state, updateState }) => {
            return <TipTapEditor state={state} updateState={updateState} supports={supports} blockStyles={blockStyles} linkBlock={linkBlock} />;
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
