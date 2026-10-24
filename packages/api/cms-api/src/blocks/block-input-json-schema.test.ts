import Ajv2020 from "ajv/dist/2020";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import type { Block } from "./block";
import { getBlockInputJsonSchema } from "./block-input-json-schema";
import { ExternalLinkBlock } from "./externalLink/external-link.block";
import { createBlocksBlock } from "./factories/createBlocksBlock";
import { createListBlock } from "./factories/createListBlock";
import { createOneOfBlock } from "./factories/createOneOfBlock";
import { SpaceBlock } from "./SpaceBlock/SpaceBlock";

function compileSchema(block: Block) {
    return new Ajv2020({ strict: true }).compile(getBlockInputJsonSchema(block));
}

async function isValidBlockInput(block: Block, input: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errors = await validate(block.blockInputFactory(input as any), { forbidNonWhitelisted: true, whitelist: true });
    return errors.length === 0;
}

describe("getBlockInputJsonSchema", () => {
    it("should derive the schema of a block from its input meta", () => {
        expect(getBlockInputJsonSchema(ExternalLinkBlock)).toEqual({
            type: "object",
            properties: {
                targetUrl: { anyOf: [{ type: "string" }, { type: "null" }] },
                openInNewWindow: { type: "boolean" },
                noFollow: { type: "boolean" },
            },
            required: ["openInNewWindow", "noFollow"],
            additionalProperties: false,
        });
    });

    it("should keep the description of a block", () => {
        const LinkListBlock = createListBlock({ block: ExternalLinkBlock }, { name: "JsonSchemaListTest", description: "A list of links." });

        expect(getBlockInputJsonSchema(LinkListBlock).description).toBe("A list of links.");
    });

    it("should put referenced blocks in the definitions", () => {
        const LinkListBlock = createListBlock({ block: ExternalLinkBlock }, "JsonSchemaDefinitionsTest");
        const schema = getBlockInputJsonSchema(LinkListBlock);

        expect(schema.$defs?.ExternalLink).toEqual(getBlockInputJsonSchema(ExternalLinkBlock));
        expect(JSON.stringify(schema)).toContain('"$ref":"#/$defs/ExternalLink"');
    });

    it("should fix the type of each block a blocks block supports", async () => {
        const BlocksBlock = createBlocksBlock({ supportedBlocks: { link: ExternalLinkBlock, space: SpaceBlock } }, "JsonSchemaBlocksTest");
        const validateSchema = compileSchema(BlocksBlock);
        const input = {
            blocks: [{ key: "1", visible: true, type: "link", props: { targetUrl: "https://example.com", openInNewWindow: false, noFollow: false } }],
        };

        expect(validateSchema(input)).toBe(true);
        expect(await isValidBlockInput(BlocksBlock, input)).toBe(true);
        expect(validateSchema({ blocks: [{ ...input.blocks[0], type: "image" }] })).toBe(false);
        expect(validateSchema({ blocks: [{ ...input.blocks[0], props: { openInNewWindow: "no" } }] })).toBe(false);
    });

    it("should describe the attached blocks of a one of block", async () => {
        const OneOfBlock = createOneOfBlock({ supportedBlocks: { external: ExternalLinkBlock } }, "JsonSchemaOneOfTest");
        const validateSchema = compileSchema(OneOfBlock);
        const input = {
            attachedBlocks: [{ type: "external", props: { targetUrl: "https://example.com", openInNewWindow: true, noFollow: false } }],
            activeType: "external",
        };

        expect(validateSchema(input)).toBe(true);
        expect(await isValidBlockInput(OneOfBlock, input)).toBe(true);
        expect(validateSchema({ attachedBlocks: [{ type: "internal", props: {} }] })).toBe(false);
    });

    it("should reference the root block itself when it is nested in itself", () => {
        const supportedBlocks: Record<string, Block> = { space: SpaceBlock, nested: SpaceBlock };
        const RecursiveBlock = createBlocksBlock({ supportedBlocks }, "JsonSchemaRecursiveTest");
        supportedBlocks.nested = RecursiveBlock;

        expect(JSON.stringify(getBlockInputJsonSchema(RecursiveBlock))).toContain('"$ref":"#"');
        expect(compileSchema(RecursiveBlock)({ blocks: [{ key: "1", visible: true, type: "nested", props: { blocks: [] } }] })).toBe(true);
    });

    it("should use the schema a block describes itself", () => {
        const SelfDescribedBlock: Block = { ...ExternalLinkBlock, blockInputJsonSchema: () => ({ type: "string" }) };
        const LinkListBlock = createListBlock({ block: SelfDescribedBlock }, "JsonSchemaSelfDescribedTest");

        expect(getBlockInputJsonSchema(LinkListBlock).$defs?.ExternalLink).toEqual({ type: "string" });
    });
});
