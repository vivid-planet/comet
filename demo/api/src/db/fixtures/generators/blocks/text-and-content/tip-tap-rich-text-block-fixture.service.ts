import { ExtractBlockInputFactoryProps } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";
import { TipTapRichTextBlock } from "@src/common/blocks/tip-tap-rich-text.block";

@Injectable()
export class TipTapRichTextBlockFixtureService {
    // Building `tipTapContent` with a known shape is only possible because `createTipTapRichTextBlock`
    // returns a fully typed Block. `ExtractBlockInputFactoryProps` resolves the `tipTapContent` property
    // here instead of an untyped record, which is what makes the block usable in typed fixture code.
    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof TipTapRichTextBlock>> {
        return {
            tipTapContent: {
                type: "doc",
                content: [
                    { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "TipTap rich text" }] },
                    {
                        type: "paragraph",
                        content: [
                            { type: "text", text: "This content is built with " },
                            { type: "text", marks: [{ type: "bold" }], text: "type-safe" },
                            { type: "text", text: " fixture code." },
                        ],
                    },
                ],
            },
        };
    }
}
