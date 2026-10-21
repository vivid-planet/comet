import { type Block, type BlockMetaField, BlockMetaFieldKind } from "./block";

type JsonSchemaType = "object" | "array" | "string" | "number" | "integer" | "boolean" | "null";

/**
 * The subset of JSON Schema (draft 2020-12) the block input schemas are built from.
 */
export interface JsonSchema {
    $ref?: string;
    $defs?: Record<string, JsonSchema>;
    description?: string;
    type?: JsonSchemaType;
    const?: string | number | boolean | null;
    enum?: Array<string | number | boolean | null>;
    properties?: Record<string, JsonSchema>;
    required?: string[];
    additionalProperties?: boolean;
    items?: JsonSchema;
    minItems?: number;
    maxItems?: number;
    minLength?: number;
    oneOf?: JsonSchema[];
    anyOf?: JsonSchema[];
}

export interface BlockInputJsonSchemaContext {
    /**
     * Returns a reference to the input schema of the block, adding the schema to the definitions.
     */
    blockRef: (block: Block) => JsonSchema;
    /**
     * Returns a reference to a definition of the block's own, building it on first use. `build` may
     * reference the definition itself, which allows describing recursive structures.
     */
    define: (name: string, build: () => JsonSchema) => JsonSchema;
}

function definitionRef(name: string): JsonSchema {
    return { $ref: `#/$defs/${name.replaceAll("~", "~0").replaceAll("/", "~1")}` };
}

/**
 * Describes the input a block accepts (what its `blockInputFactory` takes) as a JSON Schema, for
 * instance to let an AI agent produce block input.
 *
 * The schema is derived from the block meta, unless a block describes its input itself with
 * `blockInputJsonSchema`. Blocks referenced by the block are put in `$defs`. Validate the input
 * nonetheless, since not every validation rule of a block can be expressed in the schema.
 */
export function getBlockInputJsonSchema(rootBlock: Block): JsonSchema {
    const definitions: Record<string, JsonSchema> = {};
    const blockDefinitionNames = new Map<Block, string>();

    function define(name: string, build: () => JsonSchema): JsonSchema {
        if (!definitions[name]) {
            // Reserves the name, so a recursive reference while building doesn't build again.
            definitions[name] = {};
            definitions[name] = build();
        }
        return definitionRef(name);
    }

    function uniqueDefinitionName(block: Block): string {
        const takenNames = new Set(blockDefinitionNames.values());
        let name = block.name;
        for (let suffix = 2; takenNames.has(name); suffix++) {
            name = `${block.name}${suffix}`;
        }
        return name;
    }

    function blockRef(block: Block): JsonSchema {
        if (block === rootBlock) {
            return { $ref: "#" };
        }
        let name = blockDefinitionNames.get(block);
        if (!name) {
            name = uniqueDefinitionName(block);
            blockDefinitionNames.set(block, name);
        }
        const definitionName = name;
        return define(definitionName, () => buildBlockSchema(block, definitionName));
    }

    function buildBlockSchema(block: Block, definitionName: string): JsonSchema {
        const context: BlockInputJsonSchemaContext = {
            blockRef,
            define: (name, build) => define(`${definitionName}.${name}`, build),
        };
        const schema = block.blockInputJsonSchema?.(context) ?? buildObjectSchema(block.blockInputMeta.fields, context);
        return block.description ? { description: block.description, ...schema } : schema;
    }

    const schema = buildBlockSchema(rootBlock, rootBlock.name);
    return Object.keys(definitions).length > 0 ? { ...schema, $defs: definitions } : schema;
}

function buildObjectSchema(fields: BlockMetaField[], context: BlockInputJsonSchemaContext): JsonSchema {
    const properties: Record<string, JsonSchema> = {};
    for (const field of fields) {
        properties[field.name] = withNullable(buildFieldSchema(field, context), field.nullable);
    }
    const required = fields.filter((field) => !field.nullable).map((field) => field.name);
    const objectSchema: JsonSchema = { type: "object", properties, required, additionalProperties: false };

    // The blocks' items (e.g. in BlocksBlock and OneOfBlock) name the block of their `props` in the
    // sibling `type` field, so each block gets a variant with its type fixed.
    const oneOfBlocksField = fields.find((field) => field.kind === BlockMetaFieldKind.OneOfBlocks);
    const typeField = fields.find((field) => field.name === "type" && field.kind === BlockMetaFieldKind.String);
    if (oneOfBlocksField?.kind === BlockMetaFieldKind.OneOfBlocks && typeField && Object.keys(oneOfBlocksField.blocks).length > 0) {
        return {
            oneOf: Object.entries(oneOfBlocksField.blocks).map(([type, block]) => ({
                ...objectSchema,
                properties: {
                    ...properties,
                    type: { const: type },
                    [oneOfBlocksField.name]: withNullable(context.blockRef(block), oneOfBlocksField.nullable),
                },
            })),
        };
    }

    return objectSchema;
}

function buildFieldSchema(field: BlockMetaField, context: BlockInputJsonSchemaContext): JsonSchema {
    switch (field.kind) {
        case BlockMetaFieldKind.String:
            return withArray({ type: "string" }, field.array);
        case BlockMetaFieldKind.Number:
            return withArray({ type: "number" }, field.array);
        case BlockMetaFieldKind.Boolean:
            return withArray({ type: "boolean" }, field.array);
        case BlockMetaFieldKind.Json:
            return withArray({}, field.array);
        case BlockMetaFieldKind.Enum:
            return withArray({ enum: field.enum }, field.array);
        case BlockMetaFieldKind.Block:
            return context.blockRef(field.block);
        case BlockMetaFieldKind.OneOfBlocks:
            return { anyOf: Object.values(field.blocks).map((block) => context.blockRef(block)) };
        case BlockMetaFieldKind.NestedObject:
            return buildObjectSchema(field.object.fields, context);
        case BlockMetaFieldKind.NestedObjectList:
            return { type: "array", items: buildObjectSchema(field.object.fields, context) };
        case BlockMetaFieldKind.TipTapRichTextBlock:
            // The content's structure depends on the block's options, so only the block itself can describe it.
            return { type: "object" };
    }
}

function withArray(schema: JsonSchema, array: boolean | undefined): JsonSchema {
    return array ? { type: "array", items: schema } : schema;
}

function withNullable(schema: JsonSchema, nullable: boolean): JsonSchema {
    return nullable ? { anyOf: [schema, { type: "null" }] } : schema;
}
