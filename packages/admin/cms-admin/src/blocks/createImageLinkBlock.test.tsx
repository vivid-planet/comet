import { createImageLinkBlock } from "./createImageLinkBlock";
import { InternalLinkBlock } from "./InternalLinkBlock";
import { PixelImageBlock } from "./PixelImageBlock";

describe("createImageLinkBlock", () => {
    it("should allow overriding the name", () => {
        const MyCustomImageLinkBlock = createImageLinkBlock({ image: PixelImageBlock, link: InternalLinkBlock, name: "MyCustomImageLink" });

        expect(MyCustomImageLinkBlock.name).toEqual("MyCustomImageLink");
    });
});
