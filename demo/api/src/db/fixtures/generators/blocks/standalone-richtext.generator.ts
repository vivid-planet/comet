import { type ExtractBlockInputFactoryProps } from "@comet/cms-api";
import { type StandaloneRichTextBlock, TextAlignment } from "@src/common/blocks/standalone-rich-text.block";
import { generateRichtextBlock } from "@src/db/fixtures/generators/blocks/richtext.generator";

export const generateStandaloneRichTextBlock = (): ExtractBlockInputFactoryProps<typeof StandaloneRichTextBlock> => {
    return {
        richText: generateRichtextBlock(),
        textAlignment: TextAlignment.left,
    };
};
