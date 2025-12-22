import { describe, expect, it } from "vitest";

import { createImageLinkBlock } from "./createImageLinkBlock";
import { InternalLinkBlock } from "./InternalLinkBlock";
import { PixelImageBlock } from "./PixelImageBlock";

describe("createImageLinkBlock", () => {
    it("should allow overriding the name", () => {
        expect(createImageLinkBlock({ image: PixelImageBlock, link: InternalLinkBlock }).name).toEqual("ImageLink");
        expect(createImageLinkBlock({ image: PixelImageBlock, link: InternalLinkBlock, name: "MyCustomImageLink" }).name).toEqual(
            "MyCustomImageLink",
        );
    });
});
