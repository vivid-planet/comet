import { type Extensions, getSchema } from "@tiptap/core";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { Node as ProseMirrorNode, type Schema } from "@tiptap/pm/model";
import StarterKit from "@tiptap/starter-kit";
import { plainToInstance } from "class-transformer";
import { registerDecorator, type ValidationOptions } from "class-validator";

import { Block, BlockData, BlockDataFactory, BlockInputFactory, BlockInputInterface, registerBlock } from "../block";
import { AnnotationBlockMeta, BlockField } from "../decorators/field";
import { BlockFactoryNameOrOptions } from "../factories/types";
import { strictBlockDataFactoryDecorator } from "../helpers/strictBlockDataFactoryDecorator";
import { strictBlockInputFactoryDecorator } from "../helpers/strictBlockInputFactoryDecorator";
import { createAppliedMigrationsBlockDataFactoryDecorator } from "../migrations/createAppliedMigrationsBlockDataFactoryDecorator";
import { BlockDataMigrationVersion } from "../migrations/decorators/BlockDataMigrationVersion";
import { type SearchText, type WeightedSearchText } from "../search/get-search-text";
import { BlockStyleHeading } from "./extensions/BlockStyleHeading";
import { BlockStyleParagraph } from "./extensions/BlockStyleParagraph";
import { NonBreakingSpace } from "./extensions/NonBreakingSpace";
import { SoftHyphen } from "./extensions/SoftHyphen";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TipTapContent = Record<string, any>;

export type TipTapSupports =
    | "bold"
    | "italic"
    | "strike"
    | "sub"
    | "sup"
    | "heading"
    | "ordered-list"
    | "unordered-list"
    | "non-breaking-space"
    | "soft-hyphen";

export type TipTapBlockType = "paragraph" | "heading-1" | "heading-2" | "heading-3" | "heading-4" | "heading-5" | "heading-6";

export interface TipTapApiBlockStyle {
    name: string;
    appliesTo?: TipTapBlockType[];
}

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

export interface CreateTipTapRichTextBlockOptions {
    supports?: TipTapSupports[];
    blockStyles?: TipTapApiBlockStyle[];
    indexSearchText?: boolean;
}

function buildExtensions(supports: TipTapSupports[], blockStyles: TipTapApiBlockStyle[]): Extensions {
    const hasBlockStyles = blockStyles.length > 0;
    return [
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
    ];
}

// ProseMirror's Node.fromJSON silently drops unknown marks. This function
// checks the raw JSON for mark types that don't exist in the schema.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function containsUnknownMarks(json: any, schema: Schema): boolean {
    if (typeof json !== "object" || json === null) return false;

    if (Array.isArray(json.marks)) {
        for (const mark of json.marks) {
            if (typeof mark?.type === "string" && !schema.marks[mark.type]) {
                return true;
            }
        }
    }
    if (Array.isArray(json.content)) {
        for (const child of json.content) {
            if (containsUnknownMarks(child, schema)) return true;
        }
    }
    return false;
}

function IsTipTapContent(schema: Schema, validationOptions?: ValidationOptions) {
    // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isTipTapContent",
            target: object.constructor,
            propertyName,
            options: { message: "tipTapContent must be valid TipTap JSON content", ...validationOptions },
            validator: {
                validate(value: unknown) {
                    if (typeof value !== "object" || value === null) {
                        return false;
                    }
                    try {
                        // Check for unknown marks before parsing (ProseMirror silently drops them)
                        if (containsUnknownMarks(value, schema)) {
                            return false;
                        }
                        const node = ProseMirrorNode.fromJSON(schema, value);
                        node.check();
                        return true;
                    } catch {
                        return false;
                    }
                },
            },
        });
    };
}

interface TextEntry {
    text: string;
    headingLevel?: number;
}

function extractTextEntries(node: TipTapContent, headingLevel?: number): TextEntry[] {
    const results: TextEntry[] = [];
    const currentHeadingLevel = node.type === "heading" ? (node.attrs?.level as number) : headingLevel;

    if (node.text) {
        results.push({ text: node.text, headingLevel: currentHeadingLevel });
    }
    if (node.content && Array.isArray(node.content)) {
        for (const child of node.content) {
            results.push(...extractTextEntries(child, currentHeadingLevel));
        }
    }

    return results;
}

export function createTipTapRichTextBlock(
    { supports = defaultSupports, blockStyles = [], indexSearchText = true }: CreateTipTapRichTextBlockOptions = {},
    nameOrOptions: BlockFactoryNameOrOptions = "TipTapRichText",
): Block {
    const blockName = typeof nameOrOptions === "string" ? nameOrOptions : nameOrOptions.name;
    const migrate = typeof nameOrOptions !== "string" && nameOrOptions.migrate ? nameOrOptions.migrate : { migrations: [], version: 0 };

    const extensions = buildExtensions(supports, blockStyles);
    const schema = getSchema(extensions);

    @BlockDataMigrationVersion(migrate.version)
    class TipTapRichTextBlockData extends BlockData {
        @BlockField({ type: "json" })
        tipTapContent: TipTapContent;

        searchText(): SearchText[] {
            if (!indexSearchText) {
                return [];
            }

            const entries = extractTextEntries(this.tipTapContent);
            return entries.map(({ text, headingLevel }): SearchText => {
                if (headingLevel && headingLevel >= 1 && headingLevel <= 6) {
                    return { weight: `h${headingLevel}` as WeightedSearchText["weight"], text };
                }
                return text;
            });
        }
    }

    class TipTapRichTextBlockInput implements BlockInputInterface {
        @IsTipTapContent(schema)
        @BlockField({ type: "json" })
        tipTapContent: TipTapContent;

        transformToBlockData(): TipTapRichTextBlockData {
            return plainToInstance(TipTapRichTextBlockData, { tipTapContent: this.tipTapContent });
        }

        toPlain() {
            return { tipTapContent: this.tipTapContent };
        }
    }

    const blockDataFactory: BlockDataFactory<TipTapRichTextBlockData> = (o) => plainToInstance(TipTapRichTextBlockData, o);
    const blockInputFactory: BlockInputFactory<TipTapRichTextBlockInput> = (o) => plainToInstance(TipTapRichTextBlockInput, o);

    // Decorate BlockDataFactory
    let decorateBlockDataFactory = blockDataFactory;
    if (migrate.migrations) {
        const blockDataFactoryDecorator1 = createAppliedMigrationsBlockDataFactoryDecorator(migrate.migrations, blockName);
        decorateBlockDataFactory = blockDataFactoryDecorator1(decorateBlockDataFactory);
    }
    decorateBlockDataFactory = strictBlockDataFactoryDecorator(decorateBlockDataFactory);

    // Decorate BlockInputFactory
    const decorateBlockInputFactory = strictBlockInputFactoryDecorator(blockInputFactory);

    const TipTapRichTextBlock: Block = {
        name: blockName,
        blockDataFactory: decorateBlockDataFactory,
        blockInputFactory: decorateBlockInputFactory,
        blockMeta: new AnnotationBlockMeta(TipTapRichTextBlockData),
        blockInputMeta: new AnnotationBlockMeta(TipTapRichTextBlockInput),
    };

    registerBlock(TipTapRichTextBlock);

    return TipTapRichTextBlock;
}
