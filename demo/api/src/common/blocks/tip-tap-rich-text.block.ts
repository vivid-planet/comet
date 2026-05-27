import { BlockMigration, type BlockMigrationInterface, createTipTapRichTextBlock, typeSafeBlockMigrationPipe } from "@comet/cms-api";

import { LinkBlock } from "./link.block";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TipTapContent = Record<string, any>;

interface From {
    tipTapContent: TipTapContent;
}

type To = From;

// TipTap heading nodes are shaped like `{ type: "heading", attrs: { level: 1 }, content: [...] }`.
// Walk the document tree and bump every level-1 heading to level 2.
function changeHeading1ToHeading2(node: TipTapContent): TipTapContent {
    let result = node;
    if (node.type === "heading" && node.attrs?.level === 1) {
        result = { ...node, attrs: { ...node.attrs, level: 2 } };
    }
    if (Array.isArray(result.content)) {
        result = { ...result, content: result.content.map(changeHeading1ToHeading2) };
    }
    return result;
}

// `toVersion` is 2 because `migrateFromDraftJs` prepends the DraftJS->TipTap migration as version 1.
export class Heading1ToHeading2Migration extends BlockMigration<(from: From) => To> implements BlockMigrationInterface {
    public readonly toVersion = 2;

    protected migrate(from: From): To {
        return { tipTapContent: changeHeading1ToHeading2(from.tipTapContent) };
    }
}

export const TipTapRichTextBlock = createTipTapRichTextBlock(
    {
        link: LinkBlock,
        blockStyles: [
            { name: "paragraph300", appliesTo: ["paragraph"] },
            { name: "paragraph200", appliesTo: ["paragraph"] },
            { name: "eyebrow600", appliesTo: ["paragraph"] },
            { name: "eyebrow550", appliesTo: ["paragraph"] },
            { name: "eyebrow500", appliesTo: ["paragraph"] },
            { name: "eyebrow450", appliesTo: ["paragraph"] },
            { name: "list300", appliesTo: ["ordered-list", "unordered-list"] },
            { name: "list200", appliesTo: ["ordered-list", "unordered-list"] },
        ],
        inlineStyles: [{ name: "highlight" }, { name: "tag", appliesTo: ["paragraph"] }],
        migrateFromDraftJs: {
            // Map the DraftJS `blocktypeMap` entry `paragraph-small` (configured in the admin RichTextBlock)
            // to the equivalent TipTap blockStyle so legacy content keeps its smaller paragraph variant.
            blockStyleMap: { "paragraph-small": "paragraph200" },
        },
    },
    {
        name: "TipTapRichText",
        migrate: {
            migrations: typeSafeBlockMigrationPipe([Heading1ToHeading2Migration]),
            version: 2,
        },
    },
);
