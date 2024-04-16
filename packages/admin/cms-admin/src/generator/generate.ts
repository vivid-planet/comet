import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchema } from "@graphql-tools/load";
import { Command } from "commander";
import { introspectionFromSchema, IntrospectionQuery } from "graphql";

import { runFutureGenerate } from "./future/generator";
import { writeCrudForm } from "./generateForm";
import { writeCrudGrid } from "./generateGrid";
import { writeCrudPage } from "./generatePage";
import { CrudGeneratorConfig } from "./types";

async function writeCrud(options: CrudGeneratorConfig, schema: IntrospectionQuery): Promise<void> {
    await writeCrudForm(options, schema);
    await writeCrudGrid(options, schema);
    await writeCrudPage(options, schema);
}

const program = new Command();

program.addCommand(
    new Command("generate").argument("<configFile>").action(async (configFile: string) => {
        const schema = await loadSchema("./schema.gql", {
            loaders: [new GraphQLFileLoader()],
        });
        const introspection = introspectionFromSchema(schema);
        const configs: CrudGeneratorConfig[] = (await import(configFile)).default;
        for (const config of configs) {
            await writeCrud(config, introspection);
        }
    }),
);

program.addCommand(
    new Command("future-generate").option("-f, --file <file>", "config file to generate").action(async ({ file }: { file?: string }) => {
        await runFutureGenerate(file);
    }),
);

program.parse();
