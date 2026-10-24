import Ajv2020 from "ajv/dist/2020";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import type { Block } from "../block";
import { getBlockInputJsonSchema } from "../block-input-json-schema";
import { ExternalLinkBlock } from "../externalLink/external-link.block";
import { createLinkBlock } from "../factories/createLinkBlock";
import { createTipTapRichTextBlock } from "./createTipTapRichTextBlock";

type Node = Record<string, unknown>;

const text = (value: string, marks?: Node[]): Node => ({ type: "text", text: value, ...(marks ? { marks } : {}) });
const textBlock = (name: string, content: Node[] = [text("Text")], textBlockStyle?: string): Node => ({
    type: "textBlock",
    attrs: { textBlock: name, ...(textBlockStyle ? { textBlockStyle } : {}) },
    content,
});
const list = (type: "bulletList" | "orderedList", items: Node[][]): Node => ({
    type,
    content: items.map((content) => ({ type: "listItem", content })),
});
const doc = (...content: Node[]) => ({ tipTapContent: { type: "doc", content } });

async function isValidBlockInput(block: Block, input: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errors = await validate(block.blockInputFactory(input as any));
    return errors.length === 0;
}

function expectSchemaToAcceptValidInput(block: Block, inputs: unknown[]) {
    const validateSchema = new Ajv2020({ strict: true }).compile(getBlockInputJsonSchema(block));
    return Promise.all(
        inputs.map(async (input) => {
            expect(validateSchema(input), JSON.stringify(validateSchema.errors)).toBe(true);
            expect(await isValidBlockInput(block, input)).toBe(true);
        }),
    );
}

function expectSchemaToRejectInvalidInput(block: Block, inputs: unknown[]) {
    const validateSchema = new Ajv2020({ strict: true }).compile(getBlockInputJsonSchema(block));
    return Promise.all(
        inputs.map(async (input) => {
            expect(validateSchema(input), JSON.stringify(input)).toBe(false);
            expect(await isValidBlockInput(block, input)).toBe(false);
        }),
    );
}

// For content the editor never produces, but the block's validation doesn't catch.
function expectSchemaToBeStricterThanValidation(block: Block, inputs: unknown[]) {
    const validateSchema = new Ajv2020({ strict: true }).compile(getBlockInputJsonSchema(block));
    for (const input of inputs) {
        expect(validateSchema(input), JSON.stringify(input)).toBe(false);
    }
}

describe("TipTap rich text block input JSON schema", () => {
    describe("default options", () => {
        const block = createTipTapRichTextBlock({}, "TipTapJsonSchemaDefaultTest");

        it("should accept the content the block accepts", () =>
            expectSchemaToAcceptValidInput(block, [
                doc(textBlock("paragraph")),
                doc(textBlock("heading-2"), textBlock("paragraph", [text("Bold", [{ type: "bold" }]), { type: "hardBreak" }, text("Next line")])),
                doc(textBlock("paragraph", [text("a"), { type: "nonBreakingSpace" }, text("b"), { type: "softHyphen" }, text("c")])),
                doc(textBlock("paragraph", [])),
                doc(list("bulletList", [[textBlock("paragraph"), list("orderedList", [[textBlock("paragraph")]])]])),
            ]));

        it("should reject content the block rejects", () =>
            expectSchemaToRejectInvalidInput(block, [
                doc(),
                doc(textBlock("lead")),
                doc(textBlock("paragraph", [text("Underlined", [{ type: "underline" }])])),
                doc(textBlock("paragraph", [text("")])),
                doc(list("bulletList", [[textBlock("heading-2")]])),
                doc(list("bulletList", [])),
            ]));

        it("should leave out nodes the editor doesn't offer", () => {
            expectSchemaToBeStricterThanValidation(block, [doc({ type: "horizontalRule" })]);
        });
    });

    describe("text block styles", () => {
        const block = createTipTapRichTextBlock(
            {
                textBlocks: [
                    { name: "paragraph", tag: "p", styles: [{ name: "small" }] },
                    { name: "lead", tag: "p" },
                    { name: "headline", tag: "h2", styles: [{ name: "large" }] },
                ],
                unorderedList: { styles: [{ name: "compact" }] },
                orderedList: false,
            },
            "TipTapJsonSchemaStylesTest",
        );

        it("should accept the styles of a text block and its list", () =>
            expectSchemaToAcceptValidInput(block, [
                doc(textBlock("paragraph", undefined, "small"), textBlock("headline", undefined, "large"), textBlock("lead")),
                doc(list("bulletList", [[textBlock("paragraph", undefined, "compact")], [textBlock("lead", undefined, "compact")]])),
            ]));

        it("should reject styles neither the text block nor its list offers", () =>
            expectSchemaToRejectInvalidInput(block, [
                doc(textBlock("headline", undefined, "small")),
                doc(textBlock("lead", undefined, "small")),
                doc(textBlock("paragraph", undefined, "compact")),
                doc(list("orderedList", [[textBlock("paragraph")]])),
            ]));

        it("should describe a text block", () => {
            expect(JSON.stringify(getBlockInputJsonSchema(block))).toContain('Text block \\"headline\\", a heading of level 2 (<h2>).');
        });
    });

    describe("inline styles and placeholders", () => {
        const block = createTipTapRichTextBlock(
            {
                textBlocks: [
                    { name: "paragraph", tag: "p" },
                    { name: "heading-2", tag: "h2" },
                ],
                inlineStyles: [
                    { name: "highlight", appliesTo: ["paragraph"] },
                    { name: "listMarker", appliesTo: ["unordered-list"] },
                    { name: "muted" },
                ],
                placeholders: [{ name: "firstName" }],
            },
            "TipTapJsonSchemaInlineStylesTest",
        );
        const inlineStyle = (type: string) => [{ type: "inlineStyle", attrs: { type } }];

        it("should accept inline styles where they apply, and the placeholders", () =>
            expectSchemaToAcceptValidInput(block, [
                doc(textBlock("paragraph", [text("a", inlineStyle("highlight")), text("b", inlineStyle("muted"))])),
                doc(list("bulletList", [[textBlock("paragraph", [text("a", inlineStyle("listMarker"))])]])),
                doc(textBlock("heading-2", [{ type: "placeholder", attrs: { name: "firstName" } }])),
            ]));

        it("should reject inline styles where they don't apply, and unknown placeholders", () =>
            expectSchemaToRejectInvalidInput(block, [
                doc(textBlock("heading-2", [text("a", inlineStyle("highlight"))])),
                doc(list("bulletList", [[textBlock("paragraph", [text("a", inlineStyle("highlight"))])]])),
                doc(textBlock("paragraph", [{ type: "placeholder", attrs: { name: "lastName" } }])),
            ]));

        it("should reject unknown inline styles", () => {
            expectSchemaToBeStricterThanValidation(block, [doc(textBlock("paragraph", [text("a", inlineStyle("bold"))]))]);
        });
    });

    describe("limits", () => {
        const block = createTipTapRichTextBlock({ maxTextBlocks: 2, listLevelMax: 2 }, "TipTapJsonSchemaLimitsTest");
        const nestedList = (levels: number): Node => list("bulletList", [[textBlock("paragraph"), ...(levels > 1 ? [nestedList(levels - 1)] : [])]]);

        it("should accept content within the limits", () => expectSchemaToAcceptValidInput(block, [doc(textBlock("paragraph"), nestedList(2))]));

        it("should reject content exceeding the limits", () =>
            expectSchemaToRejectInvalidInput(block, [
                doc(textBlock("paragraph"), textBlock("paragraph"), textBlock("paragraph")),
                doc(nestedList(3)),
            ]));
    });

    describe("links and child blocks", () => {
        const LinkBlock = createLinkBlock({ supportedBlocks: { external: ExternalLinkBlock } }, "TipTapJsonSchemaLink");
        const block = createTipTapRichTextBlock(
            {
                link: LinkBlock,
                childBlocks: {
                    externalLink: { block: ExternalLinkBlock, display: "block" },
                    inlineLink: { block: ExternalLinkBlock, display: "inline" },
                },
            },
            "TipTapJsonSchemaLinksTest",
        );
        const externalLink = { targetUrl: "https://example.com", openInNewWindow: false, noFollow: false };
        const linkData = { attachedBlocks: [{ type: "external", props: externalLink }], activeType: "external" };

        it("should reference the link and child blocks' schemas", () => {
            const schema = getBlockInputJsonSchema(block);

            expect(Object.keys(schema.$defs ?? {})).toEqual(expect.arrayContaining(["TipTapJsonSchemaLink", "ExternalLink"]));
            expect(schema.$defs?.ExternalLink).toEqual(getBlockInputJsonSchema(ExternalLinkBlock));
        });

        it("should accept links and child blocks", () =>
            expectSchemaToAcceptValidInput(block, [
                doc(textBlock("paragraph", [text("Link", [{ type: "link", attrs: { data: linkData } }])])),
                doc(textBlock("paragraph"), { type: "cmsBlock", attrs: { blockType: "externalLink", data: externalLink } }),
                doc(textBlock("paragraph", [text("a"), { type: "cmsInlineBlock", attrs: { blockType: "inlineLink", data: externalLink } }])),
            ]));

        it("should reject invalid link data and child blocks in the wrong place", () =>
            expectSchemaToRejectInvalidInput(block, [
                doc(
                    textBlock("paragraph", [
                        text("Link", [{ type: "link", attrs: { data: { attachedBlocks: [{ type: "external", props: {} }] } } }]),
                    ]),
                ),
                doc({ type: "cmsBlock", attrs: { blockType: "image", data: externalLink } }),
            ]));

        it("should only offer a child block in the place it is displayed in", () => {
            expectSchemaToBeStricterThanValidation(block, [doc({ type: "cmsBlock", attrs: { blockType: "inlineLink", data: externalLink } })]);
        });
    });
});
