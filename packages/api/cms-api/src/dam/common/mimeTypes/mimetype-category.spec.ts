import { describe, expect, it } from "vitest";

import { getMimetypeCategory, mimetypesHaveSameCategory } from "./mimetype-category";

describe("getMimetypeCategory", () => {
    it("classifies SVG images separately from pixel images", () => {
        expect(getMimetypeCategory("image/svg+xml")).toBe("svgImage");
    });

    it("classifies pixel images", () => {
        expect(getMimetypeCategory("image/jpeg")).toBe("pixelImage");
        expect(getMimetypeCategory("image/avif")).toBe("pixelImage");
        expect(getMimetypeCategory("image/png")).toBe("pixelImage");
    });

    it("classifies audio", () => {
        expect(getMimetypeCategory("audio/mpeg")).toBe("audio");
    });

    it("classifies video", () => {
        expect(getMimetypeCategory("video/mp4")).toBe("video");
    });

    it("classifies everything else as document", () => {
        expect(getMimetypeCategory("application/pdf")).toBe("document");
        expect(getMimetypeCategory("text/plain")).toBe("document");
    });
});

describe("mimetypesHaveSameCategory", () => {
    it("allows replacing a pixel image with another pixel image", () => {
        expect(mimetypesHaveSameCategory("image/jpeg", "image/avif")).toBe(true);
    });

    it("does not treat SVG and pixel images as the same category", () => {
        expect(mimetypesHaveSameCategory("image/svg+xml", "image/jpeg")).toBe(false);
    });

    it("does not allow replacing an image with a video", () => {
        expect(mimetypesHaveSameCategory("image/jpeg", "video/mp4")).toBe(false);
    });

    it("does not allow replacing an image with a document", () => {
        expect(mimetypesHaveSameCategory("image/jpeg", "application/pdf")).toBe(false);
    });
});
