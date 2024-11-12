import type { ClassConstructor } from "class-transformer";

import {
    Block,
    BlockDataInterface,
    BlockInputInterface,
    BlockMetaField,
    BlockMetaFieldKind,
    BlockMetaInterface,
    BlockMetaLiteralFieldKind,
    isBlockDataInterface,
    isBlockInputInterface,
} from "../block";

type BlockFieldOptions =
    | {
          type: "enum";
          enum: string[] | Record<string, string>;
          nullable?: boolean;
      }
    | {
          type: "json";
          nullable?: boolean;
      }
    | {
          nullable?: boolean;
      }
    | {
          type: "block";
          nullable?: boolean;
          block: Block;
      };

export function BlockField(
    type?:
        | Block
        | { kind: "oneOfBlocks"; blocks: Record<string, Block> }
        | ClassConstructor<BlockDataInterface | BlockInputInterface>
        | BlockFieldOptions,
): PropertyDecorator {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (ctorPrototype: any, propertyKey: string | symbol): void {
        if (type) {
            Reflect.defineMetadata(`data:fieldType`, type, ctorPrototype, propertyKey);
        }
        const propertyKeys = Reflect.getOwnMetadata(`keys:field`, ctorPrototype) || (Reflect.getMetadata(`keys:field`, ctorPrototype) || []).slice(0);
        propertyKeys.push(propertyKey);
        Reflect.defineMetadata(`keys:field`, propertyKeys, ctorPrototype);
    };
}

type BlockFieldData =
    | {
          kind: BlockMetaLiteralFieldKind;
          nullable: boolean;
      }
    | { kind: BlockMetaFieldKind.Enum; enum: string[]; nullable: boolean }
    | { kind: BlockMetaFieldKind.Block; block: Block; nullable: boolean }
    | { kind: BlockMetaFieldKind.NestedObject; object: ClassConstructor<BlockDataInterface | BlockInputInterface>; nullable: boolean }
    | { kind: BlockMetaFieldKind.NestedObjectList; object: ClassConstructor<BlockDataInterface | BlockInputInterface>; nullable: boolean }
    | { kind: BlockMetaFieldKind.OneOfBlocks; blocks: Record<string, Block>; nullable: boolean };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getBlockFieldData(ctor: { prototype: any }, propertyKey: string): BlockFieldData {
    const designType = Reflect.getMetadata(`design:type`, ctor.prototype, propertyKey);
    let ret: BlockFieldData | undefined = undefined;

    const fieldType = Reflect.getMetadata(`data:fieldType`, ctor.prototype, propertyKey);

    const nullable = !!(fieldType && fieldType.nullable);

    if (fieldType && fieldType.type) {
        if (fieldType.type === "enum") {
            const enumValues = Array.isArray(fieldType.enum) ? fieldType.enum : Object.values(fieldType.enum);
            ret = { kind: BlockMetaFieldKind.Enum, enum: enumValues, nullable };
        } else if (fieldType.type === "json") {
            ret = { kind: BlockMetaFieldKind.Json, nullable };
        } else if (fieldType.type === "block") {
            ret = { kind: BlockMetaFieldKind.Block, block: fieldType.block, nullable };
        } else {
            throw new Error(`unknown field type '${fieldType.type}' for '${propertyKey}' in ${ctor}`);
        }
    } else if (isBlockDataInterface(designType.prototype) || isBlockInputInterface(designType.prototype)) {
        if (fieldType && fieldType.kind == "oneOfBlocks") {
            ret = { kind: BlockMetaFieldKind.OneOfBlocks, blocks: fieldType.blocks, nullable };
        } else {
            ret = { kind: BlockMetaFieldKind.NestedObject, object: designType, nullable };
        }
    } else {
        switch (designType.name) {
            case "String":
                ret = { kind: BlockMetaFieldKind.String, nullable };
                break;
            case "Number":
                ret = { kind: BlockMetaFieldKind.Number, nullable };
                break;
            case "Boolean":
                ret = { kind: BlockMetaFieldKind.Boolean, nullable };
                break;
            case "Object":
                if (fieldType && fieldType.blockDataFactory) {
                    ret = { kind: BlockMetaFieldKind.Block, block: fieldType, nullable };
                } else if (fieldType && (isBlockDataInterface(fieldType.prototype) || isBlockInputInterface(fieldType.prototype))) {
                    ret = { kind: BlockMetaFieldKind.NestedObject, object: fieldType, nullable };
                } else if (fieldType && fieldType.kind == "oneOfBlocks") {
                    ret = { kind: BlockMetaFieldKind.OneOfBlocks, blocks: fieldType.blocks, nullable };
                } else {
                    throw new Error(`unknown field type '${designType.name}' for '${propertyKey}' in ${ctor}`);
                }
                break;
            case "Array":
                if (!fieldType || !(isBlockDataInterface(fieldType.prototype) || isBlockInputInterface(fieldType.prototype))) {
                    throw new Error(`In ${designType.name} for ${propertyKey} only SubBlocks implementing BlockDataInterface are allowed`);
                }
                ret = { kind: BlockMetaFieldKind.NestedObjectList, object: fieldType, nullable };

                break;
            default:
                throw new Error(`unknown field type '${designType.name}' for '${propertyKey}' in ${ctor}`);
        }
    }
    return ret;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getFieldKeys(ctor: { prototype: any }): string[] {
    return (Reflect.getMetadata(`keys:field`, ctor.prototype) || []) as string[];
}

export class AnnotationBlockMeta implements BlockMetaInterface {
    constructor(protected object: ClassConstructor<BlockDataInterface | BlockInputInterface>) {}
    get fields(): BlockMetaField[] {
        const ret: BlockMetaField[] = [];
        for (const name of getFieldKeys(this.object)) {
            const field = getBlockFieldData(this.object, name);
            if (
                field.kind === BlockMetaFieldKind.String ||
                field.kind === BlockMetaFieldKind.Number ||
                field.kind === BlockMetaFieldKind.Boolean ||
                field.kind === BlockMetaFieldKind.Json
            ) {
                //literal
                ret.push({
                    name,
                    kind: field.kind,
                    nullable: field.nullable,
                });
            } else if (field.kind === BlockMetaFieldKind.Enum) {
                ret.push({
                    name,
                    kind: field.kind,
                    enum: field.enum,
                    nullable: field.nullable,
                });
            } else if (field.kind === BlockMetaFieldKind.Block) {
                ret.push({
                    name,
                    kind: field.kind,
                    block: field.block,
                    nullable: field.nullable,
                });
            } else if (field.kind === BlockMetaFieldKind.NestedObject || field.kind === BlockMetaFieldKind.NestedObjectList) {
                ret.push({
                    name,
                    kind: field.kind,
                    object: new AnnotationBlockMeta(field.object),
                    nullable: field.nullable,
                });
            } else if (field.kind === BlockMetaFieldKind.OneOfBlocks) {
                ret.push({
                    name,
                    kind: field.kind,
                    blocks: field.blocks,
                    nullable: field.nullable,
                });
            } else {
                throw new Error("Unknown field type");
            }
        }
        return ret;
    }
}
