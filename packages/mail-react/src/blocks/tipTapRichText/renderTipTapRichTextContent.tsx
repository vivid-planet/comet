import type { ComponentType, ReactNode } from "react";

import { HtmlInlineLink } from "../../components/inlineLink/HtmlInlineLink.js";
import type { BlockTextProps } from "../helpers/blockText.js";
import { getLinkBlock } from "../helpers/linkTypes.js";
import { builtInBlockTextMarkRenderers } from "../helpers/markRenderers.js";
import {
    isTipTapDoc,
    type TipTapMark,
    type TipTapNode,
    type TipTapRichTextBlockTypeProps,
    type TipTapRichTextLinkHrefResolver,
    type TipTapRichTextMarkRenderer,
    type TipTapTextBlockType,
} from "./common.js";

const nonBreakingSpace = String.fromCodePoint(0xa0);
const softHyphen = String.fromCodePoint(0xad);

interface RenderContext {
    blockTypes: Partial<Record<TipTapTextBlockType, TipTapRichTextBlockTypeProps>>;
    textBlockStyles: Record<string, TipTapRichTextBlockTypeProps>;
    linkTypes: Record<string, TipTapRichTextLinkHrefResolver>;
    marks: Record<string, TipTapRichTextMarkRenderer>;
    inlineStyles: Record<string, TipTapRichTextMarkRenderer>;
    blockTextComponent: ComponentType<BlockTextProps>;
}

const headingLevelBlockTypes: Partial<Record<number, TipTapTextBlockType>> = {
    1: "heading-1",
    2: "heading-2",
    3: "heading-3",
    4: "heading-4",
    5: "heading-5",
    6: "heading-6",
};

function getHeadingBlockType(level: unknown): TipTapTextBlockType | undefined {
    return typeof level === "number" ? headingLevelBlockTypes[level] : undefined;
}

function getStructuralBlockType(node: TipTapNode): TipTapTextBlockType | undefined {
    if (node.type === "paragraph") {
        return "paragraph";
    }
    if (node.type === "heading") {
        return getHeadingBlockType(node.attrs?.level);
    }
    if (node.type === "bulletList") {
        return "unordered-list";
    }
    if (node.type === "orderedList") {
        return "ordered-list";
    }
    return undefined;
}

function resolveBlockTypeProps(
    node: TipTapNode,
    blockTypes: RenderContext["blockTypes"],
    textBlockStyles: RenderContext["textBlockStyles"],
): TipTapRichTextBlockTypeProps {
    const textBlockStyle = node.attrs?.textBlockStyle;

    if (typeof textBlockStyle === "string" && textBlockStyles[textBlockStyle] !== undefined) {
        return textBlockStyles[textBlockStyle];
    }

    const structuralBlockType = getStructuralBlockType(node);

    return (structuralBlockType && blockTypes[structuralBlockType]) ?? {};
}

function applyMarks(children: ReactNode, marks: TipTapMark[], path: string, context: RenderContext): ReactNode {
    return marks.reduce<ReactNode>((currentChildren, mark, markIndex) => {
        const markKey = `${path}-mark-${markIndex}`;

        if (mark.type === "link") {
            const linkBlock = getLinkBlock(mark.attrs?.data);
            if (linkBlock === undefined) {
                return currentChildren;
            }

            const href = context.linkTypes[linkBlock.type]?.(linkBlock.props);
            if (href === undefined) {
                return currentChildren;
            }

            return (
                <HtmlInlineLink key={markKey} className="tipTapRichTextBlock__link" href={href}>
                    {currentChildren}
                </HtmlInlineLink>
            );
        }

        if (mark.type === "inlineStyle") {
            const styleName = mark.attrs?.type;
            const renderer = typeof styleName === "string" ? context.inlineStyles[styleName] : undefined;
            return renderer ? renderer(currentChildren, { key: markKey }) : currentChildren;
        }

        const renderer = context.marks[mark.type];
        return renderer ? renderer(currentChildren, { key: markKey }) : currentChildren;
    }, children);
}

function renderInlineNodeContent(node: TipTapNode, path: string, context: RenderContext): ReactNode {
    switch (node.type) {
        case "text":
            return node.text ?? "";
        case "hardBreak":
            return <br key={path} />;
        case "nonBreakingSpace":
            return nonBreakingSpace;
        case "softHyphen":
            return softHyphen;
        case "placeholder": {
            const name = typeof node.attrs?.name === "string" ? node.attrs.name : "";
            return `{{${name}}}`;
        }
        case "cmsBlock":
        case "cmsInlineBlock":
            return null;
        default:
            return renderInlineNodes(node.content ?? [], path, context);
    }
}

function renderInlineNode(node: TipTapNode, path: string, context: RenderContext): ReactNode {
    return applyMarks(renderInlineNodeContent(node, path, context), node.marks ?? [], path, context);
}

function renderInlineNodes(nodes: TipTapNode[], parentPath: string, context: RenderContext): ReactNode[] {
    return nodes.map((node, index) => renderInlineNode(node, `${parentPath}-${index}`, context));
}

function isListNode(node: TipTapNode): boolean {
    return node.type === "bulletList" || node.type === "orderedList";
}

function flattenListItems(listNode: TipTapNode): TipTapNode[] {
    const items: TipTapNode[] = [];

    for (const item of listNode.content ?? []) {
        if (item.type !== "listItem") {
            continue;
        }

        items.push(item);

        for (const child of item.content ?? []) {
            if (isListNode(child)) {
                items.push(...flattenListItems(child));
            }
        }
    }

    return items;
}

function renderListItemContent(item: TipTapNode, path: string, context: RenderContext): ReactNode {
    const paragraphs = (item.content ?? []).filter((child) => !isListNode(child));
    const rendered: ReactNode[] = [];

    paragraphs.forEach((paragraph, index) => {
        if (index > 0) {
            rendered.push(<br key={`${path}-break-${index}`} />);
        }
        rendered.push(...renderInlineNodes(paragraph.content ?? [], `${path}-${index}`, context));
    });

    return rendered;
}

function renderListNode(node: TipTapNode, path: string, isLast: boolean, context: RenderContext): ReactNode {
    const BlockText = context.blockTextComponent;
    const items = flattenListItems(node);
    const ListElement = node.type === "orderedList" ? "ol" : "ul";
    const blockType: TipTapTextBlockType = node.type === "orderedList" ? "ordered-list" : "unordered-list";
    const blockTypeProps = context.blockTypes[blockType] ?? {};

    return (
        <BlockText key={path} bottomSpacing={!isLast} {...blockTypeProps}>
            {/* Vertical margins are removed so the spacing between blocks comes from the theme's bottomSpacing alone. */}
            <ListElement className="tipTapRichTextBlock__list" style={{ marginTop: 0, marginBottom: 0 }}>
                {items.map((item, index) => (
                    <li key={`${path}-${index}`} className="tipTapRichTextBlock__listItem">
                        {renderListItemContent(item, `${path}-${index}`, context)}
                    </li>
                ))}
            </ListElement>
        </BlockText>
    );
}

function renderTextBlockNode(node: TipTapNode, path: string, isLast: boolean, context: RenderContext): ReactNode {
    const BlockText = context.blockTextComponent;
    const blockTypeProps = resolveBlockTypeProps(node, context.blockTypes, context.textBlockStyles);

    return (
        <BlockText key={path} bottomSpacing={!isLast} {...blockTypeProps}>
            {renderInlineNodes(node.content ?? [], path, context)}
        </BlockText>
    );
}

function renderTopLevelNode(node: TipTapNode, index: number, isLast: boolean, context: RenderContext): ReactNode {
    const path = String(index);

    if (isListNode(node)) {
        return renderListNode(node, path, isLast, context);
    }

    return renderTextBlockNode(node, path, isLast, context);
}

export interface RenderTipTapRichTextContentOptions {
    tipTapContent: unknown;
    blockTypes: Partial<Record<TipTapTextBlockType, TipTapRichTextBlockTypeProps>>;
    textBlockStyles: Record<string, TipTapRichTextBlockTypeProps>;
    linkTypes: Record<string, TipTapRichTextLinkHrefResolver>;
    marks: Record<string, TipTapRichTextMarkRenderer>;
    inlineStyles: Record<string, TipTapRichTextMarkRenderer>;
    blockTextComponent: ComponentType<BlockTextProps>;
}

export function renderTipTapRichTextContent({
    tipTapContent,
    blockTypes,
    textBlockStyles,
    linkTypes,
    marks,
    inlineStyles,
    blockTextComponent,
}: RenderTipTapRichTextContentOptions): ReactNode {
    if (!isTipTapDoc(tipTapContent)) {
        return null;
    }

    const topLevelNodes = tipTapContent.content.filter((node) => (node.content?.length ?? 0) > 0);

    if (topLevelNodes.length === 0) {
        return null;
    }

    const context: RenderContext = {
        blockTypes,
        textBlockStyles,
        linkTypes,
        marks: { ...builtInBlockTextMarkRenderers, ...marks },
        inlineStyles,
        blockTextComponent,
    };

    return topLevelNodes.map((node, index) => renderTopLevelNode(node, index, index === topLevelNodes.length - 1, context));
}
