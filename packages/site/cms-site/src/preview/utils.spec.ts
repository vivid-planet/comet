import { previewStateUrlParamName } from "./constants";
import { parsePreviewState } from "./utils";

describe("Preview utils", () => {
    it("Should parse preview state", () => {
        const state = { includeInvisibleBlocks: true };
        const parsedPreviewState = parsePreviewState({ [previewStateUrlParamName]: JSON.stringify(state) });

        expect(parsedPreviewState).toEqual(state);
    });
});
