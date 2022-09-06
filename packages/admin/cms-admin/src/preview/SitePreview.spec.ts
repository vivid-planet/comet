import { buildPreviewUrl } from "./SitePreview";

jest.mock("react-dnd", () => {
    return;
});

describe("SitePreview", () => {
    const previewUrl = "https://admin.com/preview/";
    const formattedSiteState = JSON.stringify({ includeInvisibleBlocks: true });

    it("Should build preview url", () => {
        const previewPath = "path=main";

        const result = buildPreviewUrl(previewUrl, previewPath, formattedSiteState);

        expect(result).toBe(`${previewUrl}${previewPath}?__preview=%7B%22includeInvisibleBlocks%22%3Atrue%7D`);
    });

    it("Should build preview url with query params", () => {
        const previewPath = "path=main?query=foo";

        const result = buildPreviewUrl(previewUrl, previewPath, formattedSiteState);

        expect(result).toBe(`${previewUrl}${previewPath}&__preview=%7B%22includeInvisibleBlocks%22%3Atrue%7D`);
    });
});
