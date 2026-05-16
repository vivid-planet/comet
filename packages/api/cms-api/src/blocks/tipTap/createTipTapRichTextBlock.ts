import { type Extensions, getSchema } from "@tiptap/core";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import type { Schema } from "@tiptap/pm/model";
import StarterKit from "@tiptap/starter-kit";
import { plainToInstance } from "class-transformer";
import { registerDecorator, validate, type ValidationOptions } from "class-validator";

import {
    Block,
    BlockData,
    BlockDataFactory,
    BlockDataInterface,
    BlockInputFactory,
    BlockInputInterface,
    ChildBlockInfo,
    registerBlock,
} from "../block";
import { AnnotationBlockMeta, BlockField } from "../decorators/field";
import { BlockFactoryNameOrOptions } from "../factories/types";
import { strictBlockDataFactoryDecorator } from "../helpers/strictBlockDataFactoryDecorator";
import { strictBlockInputFactoryDecorator } from "../helpers/strictBlockInputFactoryDecorator";
import { createAppliedMigrationsBlockDataFactoryDecorator } from "../migrations/createAppliedMigrationsBlockDataFactoryDecorator";
import { BlockDataMigrationVersion } from "../migrations/decorators/BlockDataMigrationVersion";
import type { SearchText, WeightedSearchText } from "../search/get-search-text";
import { BlockStyleHeading } from "./extensions/BlockStyleHeading";
import { BlockStyleParagraph } from "./extensions/BlockStyleParagraph";
import { CmsLink } from "./extensions/CmsLink";
import { NonBreakingSpace } from "./extensions/NonBreakingSpace";
import { SoftHyphen } from "./extensions/SoftHyphen";
import { buildDraftJsToTipTapMigration } from "./migrations/buildDraftJsToTipTapMigration";
import { isValidTipTapContentSync } from "./tipTapValidation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TipTapContent = Record<string, any>;

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

type TipTapBlockType =
    | "paragraph"
    | "heading-1"
    | "heading-2"
    | "heading-3"
    | "heading-4"
    | "heading-5"
    | "heading-6"
    | "ordered-list"
    | "unordered-list";

interface TipTapBlockStyle {
    name: string;
    /**
     * Limits the block style to the provided block types.
     * If none is specified, the block style is allowed for all block types.
     */
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
    blockStyles?: TipTapBlockStyle[];
    indexSearchText?: boolean;
    link?: Block;
    /**
     * Limits the maximum number of top-level blocks (paragraphs, headings, lists)
     * that can be stored. Content exceeding this limit will be rejected during validation.
     */
    maxBlocks?: number;
    /**
     * Enables best-effort block migration of DraftJS-based RichTextBlock data
     * (`{ draftContent: { blocks, entityMap } }`) into TipTap data.
     *
     * The migration uses the `supports`, `blockStyles`, `link`, and `maxBlocks` options
     * to build the target schema, validates the converted document, and falls back to a
     * stripped-down plain-text-paragraph document if validation fails.
     *
     * Pass an object with `blockStyleMap` to map DraftJS custom block types (e.g.
     * `paragraph-small` from a DraftJS `blocktypeMap`) to TipTap paragraph `blockStyle`
     * attribute values.
     */
    migrateFromDraftJs?: boolean | { blockStyleMap?: Record<string, string> };
}

function buildExtensions(supports: TipTapSupports[], blockStyles: TipTapBlockStyle[], hasLink: boolean): Extensions {
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
            link: false,
        }),
        ...(hasBlockStyles ? [BlockStyleParagraph] : []),
        ...(hasBlockStyles && supports.includes("heading") ? [BlockStyleHeading] : []),
        ...(supports.includes("sup") ? [Superscript] : []),
        ...(supports.includes("sub") ? [Subscript] : []),
        ...(supports.includes("non-breaking-space") ? [NonBreakingSpace] : []),
        ...(supports.includes("soft-hyphen") ? [SoftHyphen] : []),
        ...(hasLink ? [CmsLink] : []),
    ];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapLinkMarksData(content: TipTapContent, fn: (data: any) => any): TipTapContent {
    if (!content || typeof content !== "object") {
        return content;
    }
    const result = { ...content };

    if (Array.isArray(result.marks)) {
        result.marks = result.marks.map((mark: TipTapContent) => {
            if (mark.type === "link" && mark.attrs?.data) {
                return { ...mark, attrs: { ...mark.attrs, data: fn(mark.attrs.data) } };
            }
            return mark;
        });
    }

    if (Array.isArray(result.content)) {
        result.content = result.content.map((child: TipTapContent) => mapLinkMarksData(child, fn));
    }

    return result;
}

function collectLinkMarks(content: TipTapContent, basePath: string[] = ["tipTapContent"]): Array<{ data: unknown; path: string[] }> {
    const results: Array<{ data: unknown; path: string[] }> = [];

    if (Array.isArray(content.marks)) {
        content.marks.forEach((mark: TipTapContent, markIdx: number) => {
            if (mark.type === "link" && mark.attrs?.data) {
                results.push({
                    data: mark.attrs.data,
                    path: [...basePath, "marks", String(markIdx), "attrs", "data"],
                });
            }
        });
    }

    if (Array.isArray(content.content)) {
        content.content.forEach((child: TipTapContent, childIdx: number) => {
            results.push(...collectLinkMarks(child, [...basePath, "content", String(childIdx)]));
        });
    }

    return results;
}

function IsTipTapContent(schema: Schema, { linkBlock, maxBlocks }: { linkBlock?: Block; maxBlocks?: number }, validationOptions?: ValidationOptions) {
    // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isTipTapContent",
            target: object.constructor,
            propertyName,
            options: { message: "tipTapContent must be valid TipTap JSON content", ...validationOptions },
            validator: {
                async validate(value: unknown) {
                    if (!isValidTipTapContentSync(value, schema, { maxBlocks })) {
                        return false;
                    }

                    // Validate link mark data
                    if (linkBlock) {
                        const linkMarks = collectLinkMarks(value as TipTapContent);
                        for (const { data } of linkMarks) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const validationErrors = await validate(linkBlock.blockInputFactory(data as any), {
                                forbidNonWhitelisted: true,
                                whitelist: true,
                            });
                            if (validationErrors.length > 0) {
                                return false;
                            }
                        }
                    }

                    return true;
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

/**
 * @experimental
 */
export function createTipTapRichTextBlock(
    {
        supports = defaultSupports,
        blockStyles = [],
        indexSearchText = true,
        link: LinkBlock,
        maxBlocks,
        migrateFromDraftJs = false,
    }: CreateTipTapRichTextBlockOptions = {},
    nameOrOptions: BlockFactoryNameOrOptions = "TipTapRichText",
): Block {
    const blockName = typeof nameOrOptions === "string" ? nameOrOptions : nameOrOptions.name;
    const baseMigrate = typeof nameOrOptions !== "string" && nameOrOptions.migrate ? nameOrOptions.migrate : { migrations: [], version: 0 };

    const hasLink = !!LinkBlock;
    const extensions = buildExtensions(supports, blockStyles, hasLink);
    const schema = getSchema(extensions);

    const draftJsBlockStyleMap = typeof migrateFromDraftJs === "object" ? migrateFromDraftJs.blockStyleMap : undefined;
    const migrate = migrateFromDraftJs
        ? {
              version: baseMigrate.version + 1,
              migrations: [
                  buildDraftJsToTipTapMigration({ schema, supports, link: LinkBlock, maxBlocks, blockStyleMap: draftJsBlockStyleMap }),
                  ...baseMigrate.migrations,
              ],
          }
        : baseMigrate;

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

        childBlocksInfo(): ChildBlockInfo[] {
            if (!LinkBlock) {
                return [];
            }
            return collectLinkMarks(this.tipTapContent).map(({ data, path }) => ({
                visible: true,
                relJsonPath: path,
                block: data as BlockDataInterface,
                name: LinkBlock.name,
            }));
        }
    }

    class TipTapRichTextBlockInput implements BlockInputInterface {
        @IsTipTapContent(schema, { linkBlock: LinkBlock, maxBlocks })
        @BlockField({ type: "json" })
        tipTapContent: TipTapContent;

        transformToBlockData(): TipTapRichTextBlockData {
            let tipTapContent = this.tipTapContent;
            if (LinkBlock) {
                tipTapContent = mapLinkMarksData(tipTapContent, (data) =>
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    LinkBlock.blockInputFactory(data as any).transformToBlockData(),
                );
            }
            return plainToInstance(TipTapRichTextBlockData, { tipTapContent });
        }

        toPlain() {
            return { tipTapContent: this.tipTapContent };
        }
    }

    const blockDataFactory: BlockDataFactory<TipTapRichTextBlockData> = (o) => {
        let tipTapContent = o.tipTapContent;
        if (LinkBlock) {
            tipTapContent = mapLinkMarksData(tipTapContent, (data) => LinkBlock.blockDataFactory(data));
        }
        return plainToInstance(TipTapRichTextBlockData, { tipTapContent });
    };
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
