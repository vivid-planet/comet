import { type CrudGeneratorOptions, type CrudSingleGeneratorOptions } from "@comet/cms-api";
import { CLIHelper } from "@mikro-orm/cli";
import { type MikroORM } from "@mikro-orm/core";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { Command } from "commander";

import { generateCrud } from "./generateCrud/generate-crud";
import { generateCrudSingle } from "./generateCrudSingle/generate-crud-single";
import { writeGeneratedFiles } from "./utils/write-generated-files";

export const generateCommand = new Command("generate").action(async (options) => {
    let orm: MikroORM | null = null;
    try {
        orm = await CLIHelper.getORM(undefined, undefined, { dbName: "generator" });
    } catch (e) {
        console.warn(e);
    }

    if (orm != null) {
        const entities = orm.em.getMetadata().getAll();
        LazyMetadataStorage.load();

        for (const name in entities) {
            const entity = entities[name];
            if (!entity.class) {
                // Ignore e.g. relation entities that don't have a class
                continue;
            }
            {
                const generatorOptions = Reflect.getMetadata(`data:crudGeneratorOptions`, entity.class) as CrudGeneratorOptions | undefined;
                if (generatorOptions) {
                    const files = await generateCrud(generatorOptions, entity);
                    await writeGeneratedFiles(files, { targetDirectory: generatorOptions.targetDirectory });
                }
            }
            {
                const generatorOptions = Reflect.getMetadata(`data:crudSingleGeneratorOptions`, entity.class) as
                    | CrudSingleGeneratorOptions
                    | undefined;
                if (generatorOptions) {
                    const files = await generateCrudSingle(generatorOptions, entity);
                    await writeGeneratedFiles(files, { targetDirectory: generatorOptions.targetDirectory });
                }
            }
        }
    }
});
