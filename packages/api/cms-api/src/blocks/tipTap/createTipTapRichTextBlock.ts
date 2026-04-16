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
import { type SearchText, type WeightedSearchText } from "../search/get-search-text";
import { collectLinks, extractTextEntriesFromMarkdown, mapLinksData, validateCometMarkdown } from "./comet-markdown";

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
    | "soft-hyphen"
    | "link";

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
    link?: Block;
}

function IsCometMarkdown(
    supports: TipTapSupports[],
    blockStyles: TipTapApiBlockStyle[],
    hasLink: boolean,
    linkBlock?: Block,
    validationOptions?: ValidationOptions,
) {
    // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isCometMarkdown",
            target: object.constructor,
            propertyName,
            options: { message: "markdown must be valid Comet-flavoured markdown", ...validationOptions },
            validator: {
                async validate(value: unknown) {
                    if (typeof value !== "string") {
                        return false;
                    }

                    try {
                        // Validate markdown structure and features
                        if (!validateCometMarkdown(value, { supports, blockStyles, hasLink })) {
                            return false;
                        }

                        // Validate link block data
                        if (linkBlock) {
                            const links = collectLinks(value);
                            for (const { data } of links) {
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
                    } catch {
                        return false;
                    }
                },
            },
        });
    };
}

export function createTipTapRichTextBlock(
    { supports = defaultSupports, blockStyles = [], indexSearchText = true, link: LinkBlock }: CreateTipTapRichTextBlockOptions = {},
    nameOrOptions: BlockFactoryNameOrOptions = "TipTapRichText",
): Block {
    const blockName = typeof nameOrOptions === "string" ? nameOrOptions : nameOrOptions.name;
    const migrate = typeof nameOrOptions !== "string" && nameOrOptions.migrate ? nameOrOptions.migrate : { migrations: [], version: 0 };

    const hasLink = !!LinkBlock;

    @BlockDataMigrationVersion(migrate.version)
    class TipTapRichTextBlockData extends BlockData {
        @BlockField({ type: "string" })
        markdown: string;

        searchText(): SearchText[] {
            if (!indexSearchText) {
                return [];
            }

            const entries = extractTextEntriesFromMarkdown(this.markdown);
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
            return collectLinks(this.markdown).map(({ data, index }) => ({
                visible: true,
                relJsonPath: ["markdown", `links[${index}]`],
                block: data as BlockDataInterface,
                name: LinkBlock.name,
            }));
        }
    }

    class TipTapRichTextBlockInput implements BlockInputInterface {
        @IsCometMarkdown(supports, blockStyles, hasLink, LinkBlock)
        @BlockField({ type: "string" })
        markdown: string;

        transformToBlockData(): TipTapRichTextBlockData {
            let markdown = this.markdown;
            if (LinkBlock) {
                markdown = mapLinksData(markdown, (data) =>
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    LinkBlock.blockInputFactory(data as any).transformToBlockData(),
                );
            }
            return plainToInstance(TipTapRichTextBlockData, { markdown });
        }

        toPlain() {
            return { markdown: this.markdown };
        }
    }

    const blockDataFactory: BlockDataFactory<TipTapRichTextBlockData> = (o) => {
        let markdown = o.markdown ?? "";
        if (LinkBlock) {
            markdown = mapLinksData(markdown, (data) => LinkBlock.blockDataFactory(data));
        }
        return plainToInstance(TipTapRichTextBlockData, { markdown });
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

// Re-export for convenience
export { encodeLinkData } from "./comet-markdown";
