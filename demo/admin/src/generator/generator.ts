import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchema } from "@graphql-tools/load";
import { glob } from "glob";
import { introspectionFromSchema } from "graphql";
import { basename } from "path";

import { generateForm } from "./generateForm";
import { writeGenerated } from "./utils/writeGenerated";

type BlockReference = {
    name: string;
    import: string;
};

export type FormFieldConfig<T> = (
    | { type: "text"; multiline?: boolean }
    | { type: "staticSelect"; values?: string[] }
    | { type: "asyncSelect"; values?: string[] }
    | { type: "block"; block: BlockReference }
) & { name: keyof T; label?: string; required?: boolean };

export type FormConfig<T extends { __typename?: string }> = {
    type: "form";
    gqlType: T["__typename"];
    fragmentName?: string;
    fields: FormFieldConfig<T>[];
    title?: string;
};

export type TabsConfig = { type: "tabs"; tabs: { name: string; content: GeneratorConfig }[] };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GeneratorConfig = FormConfig<any> | TabsConfig;

export type GeneratorReturn = { code: string; gqlQueries: Record<string, string> };

async function main() {
    const schema = await loadSchema("./schema.gql", {
        loaders: [new GraphQLFileLoader()],
    });
    const gqlIntrospection = introspectionFromSchema(schema);

    const files = await glob("src/**/*.cometGen.ts");
    for (const file of files) {
        console.log("Processing", file);
        let outputCode = "";
        let gqlQueriesOutputCode = "";
        const baseOutputFilename = basename(file).replace(/\.cometGen\.ts$/, "");
        console.log("loading", `${process.cwd()}/${file.replace(/\.ts$/, "")}`);
        const configs = await import(`${process.cwd()}/${file.replace(/\.ts$/, "")}`);
        //const configs = await import(`${process.cwd()}/${file}`);
        console.log("loaded");

        for (const exportName in configs) {
            const config = configs[exportName] as GeneratorConfig;
            if (config.type == "form") {
                const generated = generateForm({ exportName, gqlIntrospection, baseOutputFilename }, config);
                outputCode += generated.code;
                for (const queryName in generated.gqlQueries) {
                    gqlQueriesOutputCode += `export const ${queryName} = gql\`${generated.gqlQueries[queryName]}\`\n`;
                }
            }
        }

        {
            const codeOuputFilename = `${file.replace(/\.cometGen\.ts$/, "")}.generated.tsx`;
            await writeGenerated(codeOuputFilename, outputCode);
        }

        if (gqlQueriesOutputCode != "") {
            const gqlQueriesOuputFilename = `${file.replace(/\.cometGen\.ts$/, "")}.generated.gql.tsx`;
            gqlQueriesOutputCode = `import { gql } from "@apollo/client";

            ${gqlQueriesOutputCode}
            `;
            await writeGenerated(gqlQueriesOuputFilename, gqlQueriesOutputCode);
        }
    }
}
main();
