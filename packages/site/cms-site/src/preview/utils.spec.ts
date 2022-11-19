import { UrlObject } from "url";

import { createPathToPreviewPath, defaultPreviewPath, parsePreviewParams } from "./utils";

describe("Preview utils", () => {
    const previewParams = parsePreviewParams({ __preview: JSON.stringify({ includeInvisibleBlocks: false }) });
    const previewPath = defaultPreviewPath;

    it("Should parse preview state", () => {
        const state = { includeInvisibleBlocks: true };
        const parsedPreviewState = parsePreviewParams({ __preview: JSON.stringify(state) });

        expect(parsedPreviewState).toEqual(state);
    });

    it("Should create preview path for string path", () => {
        const path = "/main";

        const result = createPathToPreviewPath({ path, previewPath, previewParams, baseUrl: "https://admin.com" });

        expect(result).toEqual(`${previewPath}${path}?__preview=%7B%22includeInvisibleBlocks%22%3Afalse%7D`);
    });

    it("Should create preview path for string path with query params", () => {
        const path = "/main?query=foo";

        const result = createPathToPreviewPath({ path, previewPath, previewParams, baseUrl: "https://admin.com" });

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

        const result = createPathToPreviewPath({ path, previewPath, previewParams, baseUrl: "https://admin.com" });

        expect(result).toEqual({
            ...path,
            pathname: `${previewPath}${pathname}`,
            query: {
                ...query,
                __preview: JSON.stringify(previewParams),
            },
        });
    });
});
