import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchema } from "@graphql-tools/load";
import { glob } from "glob";
import { introspectionFromSchema } from "graphql";
import { basename, dirname } from "path";

import { generateForm } from "./generateForm";
import { generateGrid } from "./generateGrid";
import { Leaves, Paths } from "./utils/deepKeyOf";
import { writeGenerated } from "./utils/writeGenerated";

type BlockReference = {
    name: string;
    import: string;
};

export type GeneratorEntity = { __typename?: string };

export type FormFieldConfigInternal =
    // extra internal type to avoid "Type instantiation is excessively deep and possibly infinite." because of name-typing and simplify typing
    (
        | { type: "text"; multiline?: boolean }
        | { type: "number" }
        | { type: "boolean" }
        | { type: "date" }
        // TODO | { type: "dateTime" }
        | { type: "staticSelect"; values?: string[] }
        | { type: "asyncSelect"; values?: string[] }
        | { type: "block"; block: BlockReference }
    ) & { name: string; label?: string; required?: boolean };
export type FormFieldConfig<T extends GeneratorEntity> = Omit<FormFieldConfigInternal, "name"> & { name: Leaves<T> | Paths<T> };

export type FormConfigInternal = {
    type: "form";
    gqlType: string;
    fragmentName?: string;
    fields: FormFieldConfigInternal[];
    title?: string;
};
export type FormConfig<T extends GeneratorEntity> = Omit<FormConfigInternal, "gqlType" | "fields"> & {
    gqlType: T["__typename"];
    fields: FormFieldConfig<T>[];
};

export type TabsConfig = { type: "tabs"; tabs: { name: string; content: GeneratorConfig }[] };

export type GridColumnConfigInternal = // extra internal type to avoid "Type instantiation is excessively deep and possibly infinite." because of name-typing and simplify typing
    (
        | { type: "text" }
        | { type: "number" }
        | { type: "boolean" }
        | { type: "date" }
        | { type: "dateTime" }
        | { type: "staticSelect"; values?: string[] }
        | { type: "block"; block: BlockReference }
    ) & { name: string; headerName?: string; width?: number };
export type GridColumnConfig<T> = Omit<GridColumnConfigInternal, "name"> & { name: Leaves<T> | Paths<T> };
export type GridConfigInternal = {
    type: "grid";
    gqlType: string;
    fragmentName?: string;
    columns: GridColumnConfigInternal[];
};
export type GridConfig<T extends GeneratorEntity> = Omit<GridConfigInternal, "gqlType" | "columns"> & {
    gqlType: T["__typename"];
    columns: GridColumnConfig<T>[];
};

export type GeneratorConfig = FormConfigInternal | GridConfigInternal | TabsConfig;

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
