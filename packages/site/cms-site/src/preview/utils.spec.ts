import { UrlObject } from "url";

import { previewStateUrlParamName } from "./constants";
import { createPathToPreviewPath, defaultPreviewPath, parsePreviewState } from "./utils";

describe("Preview utils", () => {
    const previewState = parsePreviewState({ [previewStateUrlParamName]: JSON.stringify({ includeInvisibleBlocks: false }) });
    const previewPath = defaultPreviewPath;

    it("Should parse preview state", () => {
        const state = { includeInvisibleBlocks: true };
        const parsedPreviewState = parsePreviewState({ [previewStateUrlParamName]: JSON.stringify(state) });

        expect(parsedPreviewState).toEqual(state);
    });

    it("Should create preview path for string path", () => {
        const path = "/main";

        const result = createPathToPreviewPath({ path, previewPath, previewState, baseUrl: "https://admin.com" });

        expect(result).toEqual(`${previewPath}${path}?__preview=%7B%22includeInvisibleBlocks%22%3Afalse%7D`);
    });

    it("Should create preview path for string path with query params", () => {
        const path = "/main?query=foo";

        const result = createPathToPreviewPath({ path, previewPath, previewState, baseUrl: "https://admin.com" });

        expect(result).toEqual(`${previewPath}${path}&__preview=%7B%22includeInvisibleBlocks%22%3Afalse%7D`);
    });

    it("Should create preview path for object path", () => {
        const pathname = "/[[...path]]";
        const query = {
            path: ["foo"],
        };
        const path: UrlObject = {
            pathname,
            query,
        };

        const result = createPathToPreviewPath({ path, previewPath, previewState, baseUrl: "https://admin.com" });

        expect(result).toEqual({
            ...path,
            pathname: `${previewPath}${pathname}`,
            query: {
                ...query,
                [previewStateUrlParamName]: JSON.stringify(previewState),
            },
        });
    });
});
