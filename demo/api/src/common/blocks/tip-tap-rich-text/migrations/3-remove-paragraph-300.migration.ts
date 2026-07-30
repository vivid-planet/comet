import { BlockMigration, type BlockMigrationInterface, type TipTapRichTextBlockContent } from "@comet/cms-api";

interface From {
    tipTapContent: TipTapRichTextBlockContent;
}

type To = From;

function unsetParagraph300TextBlockStyle(node: TipTapRichTextBlockContent): TipTapRichTextBlockContent {
    let result = node;
    if (node.attrs?.textBlockStyle === "paragraph300") {
        result = { ...node, attrs: { ...node.attrs, textBlockStyle: null } };
    }
    if (Array.isArray(result.content)) {
        result = { ...result, content: result.content.map(unsetParagraph300TextBlockStyle) };
    }
    return result;
}

export class RemoveParagraph300Migration extends BlockMigration<(from: From) => To> implements BlockMigrationInterface {
    public readonly toVersion = 3;

    protected migrate(from: From): To {
        return { tipTapContent: unsetParagraph300TextBlockStyle(from.tipTapContent) };
    }
}
