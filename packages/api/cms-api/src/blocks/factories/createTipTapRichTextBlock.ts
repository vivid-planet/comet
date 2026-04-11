import { plainToInstance } from "class-transformer";

import { Block, BlockData, BlockDataFactory, BlockInputFactory, BlockInputInterface, registerBlock } from "../block";
import { AnnotationBlockMeta, BlockField } from "../decorators/field";
import { strictBlockDataFactoryDecorator } from "../helpers/strictBlockDataFactoryDecorator";
import { strictBlockInputFactoryDecorator } from "../helpers/strictBlockInputFactoryDecorator";
import { createAppliedMigrationsBlockDataFactoryDecorator } from "../migrations/createAppliedMigrationsBlockDataFactoryDecorator";
import { BlockDataMigrationVersion } from "../migrations/decorators/BlockDataMigrationVersion";
import { type SearchText, type WeightedSearchText } from "../search/get-search-text";
import { BlockFactoryNameOrOptions } from "./types";

// TipTap JSON content types (simplified — no validation of structure)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TipTapContent = Record<string, any>;

interface CreateTipTapRichTextBlockOptions {
    indexSearchText?: boolean;
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
    { indexSearchText = true }: CreateTipTapRichTextBlockOptions = {},
    nameOrOptions: BlockFactoryNameOrOptions = "TipTapRichText",
): Block {
    const blockName = typeof nameOrOptions === "string" ? nameOrOptions : nameOrOptions.name;
    const migrate = typeof nameOrOptions !== "string" && nameOrOptions.migrate ? nameOrOptions.migrate : { migrations: [], version: 0 };

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
