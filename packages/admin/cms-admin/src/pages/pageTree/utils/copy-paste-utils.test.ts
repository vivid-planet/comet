import { replaceNestedIdInBlockJson } from "./copy-paste-utils";

const getBlockJson = (value: string) => {
    return {
        content: {
            blocks: [
                {
                    props: {
                        attachedBlocks: [
                            {
                                props: {
                                    damFileId: value,
                                    otherProp: "other",
                                },
                            },
                        ],
                    },
                },
            ],
        },
    };
};

describe("Copy Paste Utils", () => {
    describe(replaceNestedIdInBlockJson.name, () => {
        it("replaces old value with new value", async () => {
            const oldValue = "old-id";
            const newValue = "new-id";

            const expectedOutputBlockJson = getBlockJson(newValue);
            const inputBlockJson = getBlockJson(oldValue);
            const jsonPathArr = "content.blocks.0.props.attachedBlocks.0.props".split(".");

            expect(replaceNestedIdInBlockJson(inputBlockJson, jsonPathArr, { oldValue, newValue })).toEqual(expectedOutputBlockJson);
        });
    });
});
