import { BlockMetaFieldKind, BlockMetaInterface, getRegisteredBlocks } from "./blocks/block";

type BlockMetaField =
    | {
          name: string;
          kind: "String" | "Number" | "Boolean" | "Json";
          nullable: boolean;
      }
    | {
          name: string;
          kind: "Enum";
          nullable: boolean;
          enum: string[];
      }
    | {
          name: string;
          kind: "Block";
          nullable: boolean;
          block: string;
      }
    | {
          name: string;
          kind: "OneOfBlocks";
          nullable: boolean;
          blocks: string[];
      }
    | {
          name: string;
          kind: "NestedObject" | "NestedObjectList";
          nullable: boolean;
          object: BlockMetaNestedObject;
      };

interface BlockMeta {
    name: string;
    fields: BlockMetaField[];
    inputFields: BlockMetaField[];
}

interface BlockMetaNestedObject {
    fields: BlockMetaField[];
}

function extractFromBlockMeta(blockMeta: BlockMetaInterface): BlockMetaField[] {
    return blockMeta.fields.map((field) => {
        if (
            field.kind === BlockMetaFieldKind.String ||
            field.kind === BlockMetaFieldKind.Number ||
            field.kind === BlockMetaFieldKind.Boolean ||
            field.kind === BlockMetaFieldKind.Json
        ) {
            //literal
            return {
                name: field.name,
                kind: field.kind,
                nullable: field.nullable,
            };
        } else if (field.kind === BlockMetaFieldKind.Enum) {
            return {
                name: field.name,
                kind: field.kind,
                enum: field.enum,
                nullable: field.nullable,
            };
        } else if (field.kind === BlockMetaFieldKind.Block) {
            return {
                name: field.name,
                kind: field.kind,
                block: field.block.name,
                nullable: field.nullable,
            };
        } else if (field.kind === BlockMetaFieldKind.NestedObject || field.kind === BlockMetaFieldKind.NestedObjectList) {
            return {
                name: field.name,
                kind: field.kind,
                object: {
                    fields: extractFromBlockMeta(field.object),
                },
                nullable: field.nullable,
            };
        } else if (field.kind === BlockMetaFieldKind.OneOfBlocks) {
            return {
                name: field.name,
                kind: field.kind,
                blocks: field.blocks.map((i) => i.name),
                nullable: field.nullable,
            };
        } else {
            throw new Error("Unknown field type");
        }
    });
}

export function getBlocksMeta(): BlockMeta[] {
    return getRegisteredBlocks().map((block) => {
        const meta: BlockMeta = {
            name: block.name,
            fields: extractFromBlockMeta(block.blockMeta),
            inputFields: extractFromBlockMeta(block.blockInputMeta),
        };
        return meta;
    });
}
