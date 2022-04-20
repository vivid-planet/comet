import { promises as fs, writeFileSync } from "fs";
import * as prettier from "prettier";

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

let content = "";

function writeFieldType(field: BlockMetaField, blockNamePostfix: string) {
    if (field.kind === "String") {
        content += "string";
    } else if (field.kind === "Number") {
        content += "number";
    } else if (field.kind === "Boolean") {
        content += "boolean";
    } else if (field.kind === "Json") {
        content += "unknown";
    } else if (field.kind === "Enum") {
        content += `"${field.enum.join('" | "')}"`;
    } else if (field.kind === "Block") {
        content += `${field.block}${blockNamePostfix}`;
    } else if (field.kind === "OneOfBlocks") {
        if (field.blocks.length < 1) {
            content += "{}";
        } else {
            content += field.blocks
                .map((i) => {
                    return `${i}${blockNamePostfix}`;
                })
                .join(" | ");
        }
    } else if (field.kind === "NestedObject") {
        content += "{\n";
        field.object.fields.forEach((f) => {
            content += f.name;
            if (f.nullable) content += "?";
            content += ": ";
            writeFieldType(f, blockNamePostfix);
            content += ";\n";
        });
        content += "}\n";
    } else if (field.kind === "NestedObjectList") {
        content += "Array<{\n";
        field.object.fields.forEach((f) => {
            content += f.name;
            if (f.nullable) content += "?";
            content += ": ";
            writeFieldType(f, blockNamePostfix);
            content += ";\n";
        });
        content += "}>\n";
    }
}

(async () => {
    // eslint-disable-next-line no-console
    console.info("Generating blocks.generated.ts...");

    const blockMeta = await fs.readFile("block-meta.json").then((fileContents) => JSON.parse(fileContents.toString()) as BlockMeta[]);

    const sortedBlockMeta = blockMeta.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
    sortedBlockMeta.forEach((block) => {
        content += `export interface ${block.name}BlockData {\n`;
        block.fields.forEach((field) => {
            content += field.name;
            if (field.nullable) content += "?";
            content += ": ";
            writeFieldType(field, "BlockData");
            content += ";\n";
        });
        content += "}\n";
    });

    sortedBlockMeta.forEach((block) => {
        content += `export interface ${block.name}BlockInput {\n`;
        block.inputFields.forEach((field) => {
            content += field.name;
            if (field.nullable) content += "?";
            content += ": ";
            writeFieldType(field, "BlockInput");
            content += ";\n";
        });
        content += "}\n";
    });

    const options = await prettier.resolveConfig(process.cwd());
    writeFileSync(`./src/blocks.generated.ts`, prettier.format(content, { ...options, parser: "typescript" }));

    // eslint-disable-next-line no-console
    console.info("Done!");
})();
