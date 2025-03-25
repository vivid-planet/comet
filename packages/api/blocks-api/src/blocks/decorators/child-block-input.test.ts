import { BlockData, BlockDataInterface, BlockInput, createBlock, ExtractBlockData, ExtractBlockInput, inputToData } from "../block";
import { createRichTextBlock } from "../createRichTextBlock";
import { ExternalLinkBlock } from "../ExternalLinkBlock";
import { ChildBlock } from "./child-block";
import { ChildBlockInput } from "./child-block-input";

const RichTextBlock = createRichTextBlock({ link: ExternalLinkBlock });

class HeadlineBlockData extends BlockData {
    @ChildBlock(RichTextBlock)
    headline: ExtractBlockData<typeof RichTextBlock>;
}

class HeadlineBlockInput extends BlockInput {
    @ChildBlockInput(RichTextBlock)
    headline: ExtractBlockInput<typeof RichTextBlock>;

    transformToBlockData(): BlockDataInterface {
        return inputToData(HeadlineBlockData, this);
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
