import { describe, expect, it } from "vitest";

import { createCompositeBlockField } from "./createCompositeBlockField";

describe("createCompositeBlockField", () => {
    it("should work with an array value", () => {
        const [block] = createCompositeBlockField<string[]>({
            defaultValue: [],
            AdminComponent: () => {
                return null;
            },
        });

        expect(block.state2Output(["one", "two", "three"])).toEqual(["one", "two", "three"]);
    });
});
