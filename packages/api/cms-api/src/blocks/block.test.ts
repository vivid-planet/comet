import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BlockData, type BlockDataInterface, BlockInput, blockInputToData, createBlock } from "./block";
import { createOneOfBlock } from "./factories/createOneOfBlock";

// A block without fields, e.g., a link block variant that only marks a type.
class DealerSearchLinkBlockData extends BlockData {}

class DealerSearchLinkBlockInput extends BlockInput {
    transformToBlockData(): BlockDataInterface {
        return blockInputToData(DealerSearchLinkBlockData, this);
    }
}

const DealerSearchLinkBlock = createBlock(DealerSearchLinkBlockData, DealerSearchLinkBlockInput, "DealerSearchLink");

describe("BlockInput", () => {
    it("should validate a block without fields", async () => {
        const input = DealerSearchLinkBlock.blockInputFactory({});

        expect(await validate(input, { forbidNonWhitelisted: true, whitelist: true })).toHaveLength(0);
    });

    it("should validate a block without fields nested in another block", async () => {
        const OneOfBlock = createOneOfBlock({ supportedBlocks: { dealerSearch: DealerSearchLinkBlock } }, "OneOfDealerSearchLink");

        const input = OneOfBlock.blockInputFactory({
            attachedBlocks: [{ type: "dealerSearch", props: {} }],
            activeType: "dealerSearch",
        });

        expect(await validate(input, { forbidNonWhitelisted: true, whitelist: true })).toHaveLength(0);
    });

    it("should not add the marker required for validation to the block data", () => {
        const input = DealerSearchLinkBlock.blockInputFactory({});

        expect(input.toPlain()).toEqual({});
        expect(input.transformToBlockData().transformToSave()).toEqual({});
    });
});
