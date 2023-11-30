import { InternalLinkBlock } from "../page-tree/blocks/internal-link.block";
import { createImageLinkBlock } from "./createImageLinkBlock";

describe("createImageLinkBlock", () => {
    it("should allow overriding the name", () => {
        const MyCustomImageLinkBlock = createImageLinkBlock({ link: InternalLinkBlock }, "MyCustomImageLink");

        expect(MyCustomImageLinkBlock.name).toEqual("MyCustomImageLink");
    });
});
