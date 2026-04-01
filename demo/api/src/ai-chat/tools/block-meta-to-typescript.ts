type FieldKind = "String" | "Number" | "Boolean" | "Json" | "Enum" | "Block" | "OneOfBlocks" | "NestedObject" | "NestedObjectList";

interface MetaField {
    name: string;
    kind: FieldKind;
    nullable: boolean;
    array?: boolean;
    enum?: string[];
    block?: string;
    blocks?: Record<string, string>;
    object?: { fields: MetaField[] };
}

interface BlockMeta {
    name: string;
    inputFields: MetaField[];
}

function fieldToType(field: MetaField, siblingFields?: MetaField[]): string {
    switch (field.kind) {
        case "String": {
            const base = "string";
            return field.array ? `${base}[]` : base;
        }
        case "Number":
            return "number";
        case "Boolean":
            return "boolean";
        case "Json":
            return "unknown";
        case "Enum": {
            const union = field.enum!.map((v) => `"${v}"`).join(" | ");
            if (field.array) return `(${union})[]`;
            return union;
        }
        case "Block":
            return `${field.block}BlockData`;
        case "OneOfBlocks": {
            return Object.values(field.blocks!)
                .map((name) => `${name}BlockData`)
                .join(" | ");
        }
        case "NestedObject":
            return renderInlineObject(field.object!.fields);
        case "NestedObjectList":
            return `Array<${renderInlineObject(field.object!.fields)}>`;
        default:
            return "unknown";
    }
}

function renderInlineObject(fields: MetaField[]): string {
    const oneOfBlocksField = fields.find((f) => f.kind === "OneOfBlocks");
    const rendered = fields.map((f) => {
        let type: string;
        // When there is a sibling OneOfBlocks "props" field, render the "type" String field
        // as a union of the discriminator keys instead of bare `string`
        if (f.name === "type" && f.kind === "String" && oneOfBlocksField) {
            type = Object.keys(oneOfBlocksField.blocks!)
                .map((k) => `"${k}"`)
                .join(" | ");
        } else {
            type = fieldToType(f, fields);
        }
        const opt = f.nullable ? "?" : "";
        return `${f.name}${opt}: ${type}`;
    });
    return `{ ${rendered.join("; ")} }`;
}

function renderFields(fields: MetaField[]): string {
    return fields
        .map((f) => {
            const opt = f.nullable ? "?" : "";
            return `    ${f.name}${opt}: ${fieldToType(f)};`;
        })
        .join("\n");
}

export function blockMetaToTypeScript(meta: BlockMeta[]): string {
    const interfaces = meta.map((block) => {
        const body = block.inputFields.length > 0 ? `\n${renderFields(block.inputFields)}\n` : "";
        return `interface ${block.name}BlockInputData {${body}}`;
    });
    return interfaces.join("\n");
}
