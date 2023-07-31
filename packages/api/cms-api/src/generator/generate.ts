import { ConfigurationLoader, MikroORM, Options, Utils } from "@mikro-orm/core";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { Command } from "commander";

import { CrudGeneratorOptions, CrudSingleGeneratorOptions } from "./crud-generator.decorator";
import { generateCrud } from "./generate-crud";
import { generateCrudSingle } from "./generate-crud-single";
import { writeGeneratedFiles } from "./utils/write-generated-files";

const generate = new Command("generate").action(async (options) => {
    const orm = await getORM(false);

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
            const generatorOptions = Reflect.getMetadata(`data:crudSingleGeneratorOptions`, entity.class) as CrudSingleGeneratorOptions | undefined;
            if (generatorOptions) {
                const files = await generateCrudSingle(generatorOptions, entity);
                await writeGeneratedFiles(files, { targetDirectory: generatorOptions.targetDirectory });
            }
        }
    }

    await orm.close(true);
});

const program = new Command();

program.addCommand(generate);

program.parse();

async function getORM(warnWhenNoEntities?: boolean, opts: Partial<Options> = {}): Promise<MikroORM> {
    const options = await ConfigurationLoader.getConfiguration(warnWhenNoEntities, opts);
    options.set("allowGlobalContext", true);
    const settings = await ConfigurationLoader.getSettings();
    options.getLogger().setDebugMode(false);

    if (settings.useTsNode) {
        options.set("tsNode", true);
    }

    if (Utils.isDefined(warnWhenNoEntities)) {
        options.get("discovery").warnWhenNoEntities = warnWhenNoEntities;
    }

    return MikroORM.init(options);
}
