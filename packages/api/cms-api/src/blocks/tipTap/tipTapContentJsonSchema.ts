import type { Block } from "../block";
import type { BlockInputJsonSchemaContext, JsonSchema } from "../block-input-json-schema";
import type { TipTapResolvedOptions } from "./createTipTapRichTextBlock";
import { orderedListName, type TipTapResolvedList, type TipTapResolvedTextBlock, unorderedListName } from "./textBlocks";

type ListNodeType = "orderedList" | "bulletList";

function nodeSchema({
    type,
    attrs,
    content,
    description,
}: {
    type: string;
    attrs?: Record<string, JsonSchema>;
    content?: JsonSchema;
    description?: string;
}): JsonSchema {
    const properties: Record<string, JsonSchema> = { type: { const: type } };
    const required = ["type"];
    if (attrs) {
        properties.attrs = { type: "object", properties: attrs, required: Object.keys(attrs), additionalProperties: false };
        required.push("attrs");
    }
    if (content) {
        properties.content = content;
    }
    return { ...(description ? { description } : {}), type: "object", properties, required, additionalProperties: false };
}

function oneOfOrSingle(schemas: JsonSchema[]): JsonSchema {
    return schemas.length === 1 ? schemas[0] : { oneOf: schemas };
}

function describeTextBlock(textBlock: TipTapResolvedTextBlock): string {
    const kind = textBlock.level ? `heading of level ${textBlock.level}` : "paragraph";
    return `Text block "${textBlock.name}", a ${kind} (<${textBlock.tag}>).`;
}

/**
 * Describes the content of a TipTap rich text block with the given options, following the rules
 * the block validates its content against.
 */
export function buildTipTapContentJsonSchema({
    context,
    resolvedOptions,
    inlineStyles,
    placeholders,
    childBlocks,
    linkBlock,
    maxTextBlocks,
    listLevelMax,
}: {
    context: BlockInputJsonSchemaContext;
    resolvedOptions: TipTapResolvedOptions;
    inlineStyles: Array<{ name: string; appliesTo?: string[] }>;
    placeholders: Array<{ name: string }>;
    childBlocks: Record<string, { block: Block; display: "block" | "inline" }>;
    linkBlock?: Block;
    maxTextBlocks?: number;
    listLevelMax?: number;
}): JsonSchema {
    const lists: Array<{ nodeType: ListNodeType; name: string; list: TipTapResolvedList }> = [];
    if (resolvedOptions.orderedList) {
        lists.push({ nodeType: "orderedList", name: orderedListName, list: resolvedOptions.orderedList });
    }
    if (resolvedOptions.unorderedList) {
        lists.push({ nodeType: "bulletList", name: unorderedListName, list: resolvedOptions.unorderedList });
    }

    const hasRestrictedInlineStyles = inlineStyles.some(({ appliesTo }) => appliesTo);

    function childBlockNodes(display: "block" | "inline"): JsonSchema[] {
        return Object.entries(childBlocks)
            .filter(([, childBlock]) => childBlock.display === display)
            .map(([blockType, { block }]) =>
                nodeSchema({
                    type: display === "block" ? "cmsBlock" : "cmsInlineBlock",
                    description: block.description,
                    attrs: { blockType: { const: blockType }, data: context.blockRef(block) },
                }),
            );
    }

    function marks(stylingContext: string): JsonSchema | undefined {
        const simpleMarks = (
            [
                ["bold", resolvedOptions.bold],
                ["italic", resolvedOptions.italic],
                ["underline", resolvedOptions.underline],
                ["strike", resolvedOptions.strike],
                ["subscript", resolvedOptions.sub],
                ["superscript", resolvedOptions.sup],
            ] as const
        )
            .filter(([, isEnabled]) => isEnabled)
            .map(([type]) => nodeSchema({ type }));

        const applicableInlineStyles = inlineStyles.filter(({ appliesTo }) => !appliesTo || appliesTo.includes(stylingContext));

        const markSchemas = [
            ...simpleMarks,
            ...(applicableInlineStyles.length > 0
                ? [nodeSchema({ type: "inlineStyle", attrs: { type: { enum: applicableInlineStyles.map(({ name }) => name) } } })]
                : []),
            ...(linkBlock ? [nodeSchema({ type: "link", attrs: { data: context.blockRef(linkBlock) } })] : []),
        ];
        return markSchemas.length > 0 ? { type: "array", items: oneOfOrSingle(markSchemas) } : undefined;
    }

    // Which inline styles apply depends on the text block, or on the list a text block sits in.
    function inlineContent(stylingContext: string): JsonSchema {
        const definitionName = hasRestrictedInlineStyles ? `inline.${stylingContext}` : "inline";
        return context.define(definitionName, () => {
            const textMarks = marks(stylingContext);
            const textNode: JsonSchema = {
                type: "object",
                properties: {
                    type: { const: "text" },
                    text: { type: "string", minLength: 1 },
                    ...(textMarks ? { marks: textMarks } : {}),
                },
                required: ["type", "text"],
                additionalProperties: false,
            };
            const inlineNodes = [
                textNode,
                nodeSchema({ type: "hardBreak", description: "A line break within the text block." }),
                ...(resolvedOptions.nonBreakingSpace ? [nodeSchema({ type: "nonBreakingSpace" })] : []),
                ...(resolvedOptions.softHyphen ? [nodeSchema({ type: "softHyphen" })] : []),
                ...(placeholders.length > 0
                    ? [
                          nodeSchema({
                              type: "placeholder",
                              description: "Replaced with the placeholder's value when the content is rendered.",
                              attrs: { name: { enum: placeholders.map(({ name }) => name) } },
                          }),
                      ]
                    : []),
                ...childBlockNodes("inline"),
            ];
            return { type: "array", items: oneOfOrSingle(inlineNodes) };
        });
    }

    function textBlockNode(textBlock: TipTapResolvedTextBlock, containingList?: { name: string; list: TipTapResolvedList }): JsonSchema {
        const styles = [...textBlock.styles, ...(containingList?.list.styles ?? [])].map((style) => style.name);
        return nodeSchema({
            type: "textBlock",
            description: describeTextBlock(textBlock),
            attrs: {
                textBlock: { const: textBlock.name },
                ...(styles.length > 0 ? { textBlockStyle: { enum: [...new Set(styles)] } } : {}),
            },
            content: inlineContent(containingList?.name ?? textBlock.name),
        });
    }

    // Unrolled per level with `listLevelMax`, so the schema itself limits the nesting.
    function listNode({ nodeType, name, list }: (typeof lists)[number], level: number): JsonSchema {
        const definitionName = listLevelMax === undefined ? nodeType : `${nodeType}.level${level}`;
        return context.define(definitionName, () => {
            const canNest = listLevelMax === undefined || level < listLevelMax;
            const listItem = nodeSchema({
                type: "listItem",
                description: "The first node of a list item must be a text block.",
                content: {
                    type: "array",
                    minItems: 1,
                    items: oneOfOrSingle([
                        // Lists hold paragraphs only, so content can't put a heading into a list item.
                        ...resolvedOptions.textBlocks
                            .filter((textBlock) => textBlock.tag === "p")
                            .map((textBlock) => textBlockNode(textBlock, { name, list })),
                        ...(canNest ? lists.map((nestedList) => listNode(nestedList, level + 1)) : []),
                        ...childBlockNodes("block"),
                    ]),
                },
            });
            return nodeSchema({ type: nodeType, content: { type: "array", minItems: 1, items: listItem } });
        });
    }

    return {
        type: "object",
        properties: {
            type: { const: "doc" },
            content: {
                type: "array",
                minItems: 1,
                ...(maxTextBlocks !== undefined ? { maxItems: maxTextBlocks } : {}),
                items: oneOfOrSingle([
                    ...resolvedOptions.textBlocks.map((textBlock) => textBlockNode(textBlock)),
                    ...lists.map((list) => listNode(list, 1)),
                    ...childBlockNodes("block"),
                ]),
            },
        },
        required: ["type", "content"],
        additionalProperties: false,
    };
}
