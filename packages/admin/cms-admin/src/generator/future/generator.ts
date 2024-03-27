import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchema } from "@graphql-tools/load";
import { GridColDef } from "@mui/x-data-grid";
import { glob } from "glob";
import { introspectionFromSchema } from "graphql";
import { basename, dirname } from "path";

import { generateForm } from "./generateForm";
import { generateGrid } from "./generateGrid";
import { UsableFields } from "./utils/usableFields";
import { writeGenerated } from "./utils/writeGenerated";

type ImportReference = {
    name: string;
    import: string;
};

export type GeneratorEntity = { __typename?: string };

export type FormFieldConfig<T extends GeneratorEntity> = (
    | { type: "text"; multiline?: boolean }
    | { type: "number" }
    | { type: "boolean" }
    | { type: "date" }
    // TODO | { type: "dateTime" }
    | { type: "staticSelect"; values?: string[] }
    | { type: "asyncSelect"; rootQuery: string; labelField?: string }
    | { type: "block"; block: ImportReference }
) & { name: UsableFields<T>; label?: string; required?: boolean; validate?: ImportReference; helperText?: string; readOnly?: boolean };

export type FormConfig<T extends GeneratorEntity> = {
    type: "form";
    gqlType: T["__typename"];
    fragmentName?: string;
    fields: FormFieldConfig<T>[];
    title?: string;
};

export type TabsConfig = { type: "tabs"; tabs: { name: string; content: GeneratorConfig }[] };

type DataGridSettings = Pick<GridColDef, "headerName" | "width" | "minWidth" | "maxWidth" | "flex">;

export type GridColumnConfig<T extends GeneratorEntity> = (
    | { type: "text" }
    | { type: "number" }
    | { type: "boolean" }
    | { type: "date" }
    | { type: "dateTime" }
    | { type: "staticSelect"; values?: string[] }
    | { type: "block"; block: ImportReference }
) & { name: keyof T } & DataGridSettings;
export type GridConfig<T extends GeneratorEntity> = {
    type: "grid";
    gqlType: T["__typename"];
    fragmentName?: string;
    columns: GridColumnConfig<T>[];
    add?: boolean;
    edit?: boolean;
    delete?: boolean;
    copyPaste?: boolean;
    readOnly?: boolean;
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
