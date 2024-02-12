import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchema } from "@graphql-tools/load";
import { glob } from "glob";
import { introspectionFromSchema } from "graphql";
import { basename, dirname } from "path";

import { generateForm } from "./generateForm";
import { generateGrid } from "./generateGrid";
import { writeGenerated } from "./utils/writeGenerated";

type BlockReference = {
    name: string;
    import: string;
};

export type FormLayoutConfig<T> = { type: "collapsible"; title: string; supportText?: string | keyof T; fields: FormFieldConfig<T>[] };
export type FormFieldConfig<T> = (
    | { type: "text"; multiline?: boolean }
    | { type: "number" }
    | { type: "numberRange"; minField?: string | "min"; maxField?: string | "max" } // TODO probably this will not be needed.
    | { type: "boolean" }
    | { type: "booleanList"; values?: string[] }
    | { type: "date" }
    // TODO | { type: "dateTime" }
    | { type: "staticSelect"; values?: string[] }
    | { type: "staticRadio"; values?: string[] } // TODO UX-Team validates if this is even required or we can use staticSelect
    | { type: "asyncSelect"; values?: string[] } // TODO this could be combined with staticSelect to type="select" supporting both cases
    | {
          type: "fileUpload";
          multiple?: boolean;
          preview?: boolean;
          button?: boolean;
          dropzone?: boolean;
          accept?: { [key: string]: string[] };
          maxFileSize?: number;
      }
    | { type: "block"; block: BlockReference }
) & { name: keyof T; label?: string; required?: boolean };

export type FormConfig<T extends { __typename?: string }> = {
    type: "form";
    gqlType: T["__typename"];
    fragmentName?: string;
    fields: (FormFieldConfig<T> | FormLayoutConfig<T>)[];
    title?: string;
};

export type TabsConfig = { type: "tabs"; tabs: { name: string; content: GeneratorConfig }[] };

export type GridColumnConfig<T> = (
    | { type: "text" }
    | { type: "number" }
    | { type: "boolean" }
    | { type: "date" }
    | { type: "dateTime" }
    | { type: "staticSelect"; values?: string[] }
    | { type: "block"; block: BlockReference }
) & { name: keyof T; headerName?: string; width?: number };
export type GridConfig<T extends { __typename?: string }> = {
    type: "grid";
    gqlType: T["__typename"];
    fragmentName?: string;
    columns: GridColumnConfig<T>[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GeneratorConfig = FormConfig<any> | GridConfig<any> | TabsConfig;

export type GeneratorReturn = { code: string; gqlDocuments: Record<string, string> };

export async function runFutureGenerate() {
    const schema = await loadSchema("./schema.gql", {
        loaders: [new GraphQLFileLoader()],
    });
    const gqlIntrospection = introspectionFromSchema(schema);

    const files = await glob("src/**/*.cometGen.ts");
    for (const file of files) {
        let outputCode = "";
        let gqlDocumentsOutputCode = "";
        const targetDirectory = `${dirname(file)}/generated`;
        const baseOutputFilename = basename(file).replace(/\.cometGen\.ts$/, "");
        const configs = await import(`${process.cwd()}/${file.replace(/\.ts$/, "")}`);
        //const configs = await import(`${process.cwd()}/${file}`);

        for (const exportName in configs) {
            const config = configs[exportName] as GeneratorConfig;
            let generated: GeneratorReturn;
            if (config.type == "form") {
                generated = generateForm({ exportName, gqlIntrospection, baseOutputFilename, targetDirectory }, config);
            } else if (config.type == "grid") {
                generated = generateGrid({ exportName, gqlIntrospection, baseOutputFilename, targetDirectory }, config);
            } else {
                throw new Error(`Unknown config type: ${config.type}`);
            }
            outputCode += generated.code;
            for (const queryName in generated.gqlDocuments) {
                gqlDocumentsOutputCode += `export const ${queryName} = gql\`${generated.gqlDocuments[queryName]}\`\n`;
            }
        }

        {
            const codeOuputFilename = `${targetDirectory}/${basename(file.replace(/\.cometGen\.ts$/, ""))}.tsx`;
            await writeGenerated(codeOuputFilename, outputCode);
        }

        if (gqlDocumentsOutputCode != "") {
            const gqlDocumentsOuputFilename = `${targetDirectory}/${basename(file.replace(/\.cometGen\.ts$/, ""))}.gql.tsx`;
            gqlDocumentsOutputCode = `import { gql } from "@apollo/client";

            ${gqlDocumentsOutputCode}
            `;
            await writeGenerated(gqlDocumentsOuputFilename, gqlDocumentsOutputCode);
        }
    }
}
