import { createBlocksBlock } from "../factories/createBlocksBlock";
import { createOneOfBlock } from "../factories/createOneOfBlock";
import { createOptionalBlock } from "../factories/createOptionalBlock";
import { composeBlocks } from "../helpers/composeBlocks";
import { ABlock } from "./test/blocks/ABlock";
import { BBlock } from "./test/blocks/BBlock";
import { CBlock } from "./test/blocks/CBlock";
import { ImageBlock } from "./test/blocks/ImageBlock";
import { transformToSaveIndex } from "./transformToSaveIndex";

describe("transform to save index", () => {
    it("build correctly", () => {
        const TestBlock = createBlocksBlock(
            {
                supportedBlocks: {
                    a: ABlock,
                    b: BBlock,
                    oneof: createOneOfBlock({ supportedBlocks: { a: ABlock, c: CBlock } }, "OneOf"),
                    optional: createOptionalBlock(BBlock),
                    composed: composeBlocks({ blocks: { b: BBlock, c: CBlock } }, "Composed"),
                },
            },
            "TestBlock",
        );

        const testBlock = TestBlock.blockInputFactory({
            blocks: [
                {
                    key: "a",
                    type: "a",
                    visible: true,
                    props: {
                        titleA: "[0]titleA",
                        b: { titleB: "[0]titleB", c1: { titleC: "[0]titleC1" }, c2: { titleC: "[0]titleC2" } },
                        c: { titleC: "[0]titleC" },
                    },
                },
                {
                    key: "b",
                    type: "b",
                    visible: true,
                    props: {
                        titleB: "[1]titleB",
                        c1: { titleC: "[1]titleC1" },
                        c2: { titleC: "[1]titleC2" },
                    },
                },
                {
                    key: "c",
                    type: "oneof",
                    visible: true,
                    props: {
                        attachedBlocks: [
                            {
                                type: "a",
                                props: {
                                    titleA: "[20]titleA",
                                    b: { titleB: "[20]titleB", c1: { titleC: "[20]titleC1" }, c2: { titleC: "[20]titleC2" } },
                                    c: { titleC: "[20]titleC" },
                                },
                            },
                            {
                                type: "c",
                                props: {
                                    titleC: "[21]titleC",
                                },
                            },
                        ],
                        activeType: "c",
                    },
                },
                {
                    key: "d",
                    type: "optional",
                    visible: true,
                    props: {
                        visible: false,
                        block: { titleB: "[3]titleB", c1: { titleC: "[3]titleC1" }, c2: { titleC: "[3]titleC2" } },
                    },
                },
                {
                    key: "e",
                    type: "composed",
                    visible: true,
                    props: {
                        c: { titleC: "[4]titleC" },
                        b: { titleB: "[4]titleB", c1: { titleC: "[4]titleC1" }, c2: { titleC: "[4]titleC2" } },
                    },
                },
            ],
        }).transformToBlockData();

        const result = transformToSaveIndex(TestBlock, testBlock);

        expect(result).toStrictEqual([
            { blockname: "TestBlock", jsonPath: "root", visible: true, target: [] },
            {
                blockname: "ATestBlock",
                jsonPath: "root.blocks.0.props",
                visible: true,
                target: [],
            },
            {
                blockname: "BTestBlock",
                jsonPath: "root.blocks.0.props.b",
                visible: true,
                target: [],
            },
            {
                blockname: "CTestBlock",
                jsonPath: "root.blocks.0.props.b.c1",
                visible: true,
                target: [],
            },
            {
                blockname: "CTestBlock",
                jsonPath: "root.blocks.0.props.b.c2",
                visible: true,
                target: [],
            },
            {
                blockname: "CTestBlock",
                jsonPath: "root.blocks.0.props.c",
                visible: true,
                target: [],
            },
            {
                blockname: "BTestBlock",
                jsonPath: "root.blocks.1.props",
                visible: true,
                target: [],
            },
            {
                blockname: "CTestBlock",
                jsonPath: "root.blocks.1.props.c1",
                visible: true,
                target: [],
            },
            {
                blockname: "CTestBlock",
                jsonPath: "root.blocks.1.props.c2",
                visible: true,
                target: [],
            },
            {
                blockname: "OneOf",
                jsonPath: "root.blocks.2.props",
                visible: true,
                target: [],
            },
            {
                blockname: "ATestBlock",
                jsonPath: "root.blocks.2.props.attachedBlocks.0.props",
                visible: false,
                target: [],
            },
            {
                blockname: "BTestBlock",
                jsonPath: "root.blocks.2.props.attachedBlocks.0.props.b",
                visible: false,
                target: [],
            },
            {
                blockname: "CTestBlock",
                jsonPath: "root.blocks.2.props.attachedBlocks.0.props.b.c1",
                visible: false,
                target: [],
            },
            {
                blockname: "CTestBlock",
                jsonPath: "root.blocks.2.props.attachedBlocks.0.props.b.c2",
                visible: false,
                target: [],
            },
            {
                blockname: "CTestBlock",
                jsonPath: "root.blocks.2.props.attachedBlocks.0.props.c",
                visible: false,
                target: [],
            },
            {
                blockname: "CTestBlock",
                jsonPath: "root.blocks.2.props.attachedBlocks.1.props",
                visible: true,
                target: [],
            },
            {
                blockname: "OptionalBTestBlock",
                jsonPath: "root.blocks.3.props",
                visible: true,
                target: [],
            },
            {
                blockname: "BTestBlock",
                jsonPath: "root.blocks.3.props.block",
                visible: false,
                target: [],
            },
            {
                blockname: "CTestBlock",
                jsonPath: "root.blocks.3.props.block.c1",
                visible: false,
                target: [],
            },
            {
                blockname: "CTestBlock",
                jsonPath: "root.blocks.3.props.block.c2",
                visible: false,
                target: [],
            },
            {
                blockname: "Composed",
                jsonPath: "root.blocks.4.props",
                visible: true,
                target: [],
            },
            {
                blockname: "BTestBlock",
                jsonPath: "root.blocks.4.props.b",
                visible: true,
                target: [],
            },
            {
                blockname: "CTestBlock",
                jsonPath: "root.blocks.4.props.b.c1",
                visible: true,
                target: [],
            },
            {
                blockname: "CTestBlock",
                jsonPath: "root.blocks.4.props.b.c2",
                visible: true,
                target: [],
            },
            {
                blockname: "CTestBlock",
                jsonPath: "root.blocks.4.props.c",
                visible: true,
                target: [],
            },
        ]);
    });
    it("extract id of DamFile", () => {
        const TestBlock = createBlocksBlock({ supportedBlocks: { image: ImageBlock, image2: ImageBlock } }, "TestBlock");

        const testBlock = TestBlock.blockInputFactory({
            blocks: [{ key: "a", type: "image", visible: true, props: { damFileId: "abc" } }],
        }).transformToBlockData();

        const result = transformToSaveIndex(TestBlock, testBlock);

        expect(result).toStrictEqual([
            { blockname: "TestBlock", jsonPath: "root", visible: true, target: [] },
            {
                blockname: "ImageBlock",
                jsonPath: "root.blocks.0.props",
                visible: true,
                target: [
                    {
                        targetEntityName: "File",
                        id: "abc",
                    },
                ],
            },
        ]);
    });
});
