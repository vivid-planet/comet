import { BlockData, BlockDataInterface, BlockInput, blockInputToData, createBlock, ExtractBlockData, ExtractBlockInput } from "../block.js";
import { ExternalLinkBlock } from "../ExternalLinkBlock.js";
import { createRichTextBlock } from "../factories/createRichTextBlock.js";
import { ChildBlock } from "./child-block.js";
import { ChildBlockInput } from "./child-block-input.js";

const RichTextBlock = createRichTextBlock({ link: ExternalLinkBlock });

class HeadlineBlockData extends BlockData {
    @ChildBlock(RichTextBlock)
    headline: ExtractBlockData<typeof RichTextBlock>;
}

class HeadlineBlockInput extends BlockInput {
    @ChildBlockInput(RichTextBlock)
    headline: ExtractBlockInput<typeof RichTextBlock>;

    transformToBlockData(): BlockDataInterface {
        return blockInputToData(HeadlineBlockData, this);
    }
}

const HeadlineBlock = createBlock(HeadlineBlockData, HeadlineBlockInput, "Headline");

describe("ChildBlockInput", () => {
    it("should fail if no value is provided", () => {
        // `@Transform()` allows any value, so we use any here.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const plain: any = {};

        expect(() => {
            HeadlineBlock.blockInputFactory(plain);
        }).toThrowError(`Missing child block input for 'headline' (RichText)`);
    });
});
