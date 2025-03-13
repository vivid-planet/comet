import { type CrudGeneratorOptions, type CrudSingleGeneratorOptions } from "@comet/cms-api";
import { CLIHelper } from "@mikro-orm/cli";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { Command } from "commander";

import { generateCrud } from "./generateCrud/generate-crud";
import { generateCrudSingle } from "./generateCrudSingle/generate-crud-single";
import { writeGeneratedFiles } from "./utils/write-generated-files";

export const generateCommand = new Command("generate").action(async (options) => {
    const orm = await CLIHelper.getORM(undefined, undefined, {
        dbName: "generator",
        discovery: {
            warnWhenNoEntities: false,
        },
    });

    const entities = orm.em.getMetadata().getAll();
    LazyMetadataStorage.load();

    if (Object.keys(entities).length === 0) {
        console.warn(`No entities found for the generated command.`);
    }
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
            const generatorOptions = Reflect.getMetadata(`data:crudSingleGeneratorOptions`, entity.class) as CrudSingleGeneratorOptions | undefined;
            if (generatorOptions) {
                const files = await generateCrudSingle(generatorOptions, entity);
                await writeGeneratedFiles(files, { targetDirectory: generatorOptions.targetDirectory });
            }
        }
    }
    await orm.close(true);
});
