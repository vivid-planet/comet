import { describe, expect, it, vi } from "vitest";

import { withAdditionalBlockAttributes } from "../withAdditionalBlockAttributes";

type BaseState = { title: string; count: number };
type BaseInput = BaseState;
type BaseOutput = BaseState;

function createMockBlock() {
    return {
        defaultValues: () => ({ title: "hello", count: 1 }),
        input2State: (input: BaseInput) => ({ title: input.title, count: input.count }),
        state2Output: (state: BaseState) => ({ title: state.title, count: state.count }),
        output2State: async (output: BaseOutput) => ({ title: output.title, count: output.count }),
        createPreviewState: (state: BaseState) => ({ title: state.title, count: state.count }),
        // remaining BlockMethods — unused by the decorator but required by the spread
        isValid: () => true,
        previewContent: () => [],
        replaceDependenciesInOutput: (output: BaseOutput) => output,
        resolveDependencyPath: (_state: BaseState, jsonPath: string) => jsonPath,
    };
}

describe("withAdditionalBlockAttributes", () => {
    describe("defaultValues", () => {
        it("merges additional attributes into the base defaults", () => {
            const decorated = withAdditionalBlockAttributes({ hidden: false })(createMockBlock());
            expect(decorated.defaultValues()).toEqual({ title: "hello", count: 1, hidden: false });
        });

        it("additional attribute overrides a conflicting base default", () => {
            const decorated = withAdditionalBlockAttributes({ title: "overridden" })(createMockBlock());
            expect(decorated.defaultValues().title).toBe("overridden");
        });
    });

    describe("input2State", () => {
        it("picks additional-attribute keys from the input and merges with base result", () => {
            const decorated = withAdditionalBlockAttributes({ hidden: true })(createMockBlock());
            const result = decorated.input2State({ title: "test", count: 5, hidden: false });
            expect(result).toEqual({ title: "test", count: 5, hidden: false });
        });

        it("uses the input value for the additional key, not the add default", () => {
            const decorated = withAdditionalBlockAttributes({ hidden: true })(createMockBlock());
            // Even though hidden default is true, the input carries false
            const result = decorated.input2State({ title: "x", count: 0, hidden: false });
            expect(result.hidden).toBe(false);
        });
    });

    describe("state2Output", () => {
        it("picks additional-attribute keys from state and merges with base result", () => {
            const decorated = withAdditionalBlockAttributes({ visible: true })(createMockBlock());
            const result = decorated.state2Output({ title: "foo", count: 2, visible: false });
            expect(result).toEqual({ title: "foo", count: 2, visible: false });
        });
    });

    describe("output2State", () => {
        it("awaits the base block and merges additional keys from output", async () => {
            const decorated = withAdditionalBlockAttributes({ tag: "promo" })(createMockBlock());
            const result = await decorated.output2State({ title: "bar", count: 3, tag: "sale" }, {} as never);
            expect(result).toEqual({ title: "bar", count: 3, tag: "sale" });
        });

        it("awaits the base block's async output2State before merging", async () => {
            const order: string[] = [];
            const block = {
                ...createMockBlock(),
                output2State: async (output: BaseOutput) => {
                    await new Promise<void>((resolve) => setTimeout(resolve, 0));
                    order.push("base");
                    return { title: output.title, count: output.count };
                },
            };
            const decorated = withAdditionalBlockAttributes({ extra: 99 })(block);
            const result = await decorated.output2State({ title: "t", count: 0, extra: 42 }, {} as never);
            expect(order).toEqual(["base"]);
            expect(result.extra).toBe(42);
        });
    });

    describe("createPreviewState", () => {
        it("picks additional-attribute keys from state and merges with base result", () => {
            const decorated = withAdditionalBlockAttributes({ highlight: true })(createMockBlock());
            const result = decorated.createPreviewState({ title: "preview", count: 7, highlight: false }, {} as never);
            expect(result).toEqual({ title: "preview", count: 7, highlight: false });
        });
    });

    describe("with empty add object", () => {
        it("returns results identical to the base block when add is empty", () => {
            const block = createMockBlock();
            const decorated = withAdditionalBlockAttributes({})(block);
            expect(decorated.defaultValues()).toEqual(block.defaultValues());
            expect(decorated.input2State({ title: "a", count: 1 })).toEqual(block.input2State({ title: "a", count: 1 }));
            expect(decorated.state2Output({ title: "a", count: 1 })).toEqual(block.state2Output({ title: "a", count: 1 }));
        });
    });

    describe("overrides", () => {
        it("allows overriding a decorated method", () => {
            const customDefaultValues = vi.fn(() => ({ title: "custom", count: 99, hidden: false }));
            const decorated = withAdditionalBlockAttributes({ hidden: false })(createMockBlock(), {
                defaultValues: customDefaultValues,
            });
            const result = decorated.defaultValues();
            expect(customDefaultValues).toHaveBeenCalledOnce();
            expect(result).toEqual({ title: "custom", count: 99, hidden: false });
        });
    });
});
