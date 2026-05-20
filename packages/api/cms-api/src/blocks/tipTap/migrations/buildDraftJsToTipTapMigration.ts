import type { Schema } from "@tiptap/pm/model";
import type { ClassConstructor } from "class-transformer";

import type { Block } from "../../block";
import { BlockMigration } from "../../migrations/BlockMigration";
import type { BlockMigrationInterface } from "../../migrations/types";
import { isValidTipTapContentSync } from "../tipTapValidation";
import { buildStrippedTipTapDoc, convertDraftJsToTipTap, type ConvertOptions, type DraftJsContent } from "./convertDraftJsToTipTap";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TipTapContent = Record<string, any>;

interface From {
    draftContent?: DraftJsContent;
    tipTapContent?: TipTapContent;
}

interface To {
    tipTapContent: TipTapContent;
}

function isDraftJsContent(value: unknown): value is DraftJsContent {
    return (
        typeof value === "object" &&
        value !== null &&
        "blocks" in value &&
        Array.isArray((value as DraftJsContent).blocks) &&
        "entityMap" in value &&
        typeof (value as DraftJsContent).entityMap === "object" &&
        (value as DraftJsContent).entityMap !== null
    );
}

interface BuildOptions extends ConvertOptions {
    schema: Schema;
    maxBlocks?: number;
    link?: Block;
}

const EMPTY_DOC: TipTapContent = { type: "doc", content: [{ type: "paragraph" }] };

export function buildDraftJsToTipTapMigration(options: BuildOptions): ClassConstructor<BlockMigrationInterface> {
    const { schema, maxBlocks, supports, link, blockStyleMap, inlineStyleMap } = options;

    return class DraftJsToTipTapMigration extends BlockMigration<(from: From) => To> implements BlockMigrationInterface {
        public readonly toVersion = 1;

        protected migrate(from: From): To {
            // No-op for data that does not look like DraftJS (e.g. already TipTap-shaped).
            if (!isDraftJsContent(from.draftContent)) {
                if (from.tipTapContent !== undefined) {
                    return { tipTapContent: from.tipTapContent };
                }
                return { tipTapContent: EMPTY_DOC };
            }

            const converted = convertDraftJsToTipTap(from.draftContent, { supports, link, blockStyleMap, inlineStyleMap });
            if (isValidTipTapContentSync(converted, schema, { maxBlocks })) {
                return { tipTapContent: converted };
            }

            if (process.env.NODE_ENV === "development") {
                throw new Error(`DraftJS->TipTap migration produced invalid content that doesn't pass validation`);
            }

            const stripped = buildStrippedTipTapDoc(from.draftContent);
            if (isValidTipTapContentSync(stripped, schema, { maxBlocks })) {
                console.warn("DraftJS->TipTap migration failed, using stripped content");
                return { tipTapContent: stripped };
            }

            console.warn("DraftJS->TipTap migration failed, lost content!");
            return { tipTapContent: EMPTY_DOC };
        }
    };
}
