import { createCompositeSetting } from "./createCompositeSetting";

describe("createCompositeSetting", () => {
    it("should work with an array value", () => {
        const [block] = createCompositeSetting<string[]>({
            defaultValue: [],
            AdminComponent: () => {
                return null;
            },
        });

        expect(block.state2Output(["one", "two", "three"])).toEqual(["one", "two", "three"]);
    });
});
