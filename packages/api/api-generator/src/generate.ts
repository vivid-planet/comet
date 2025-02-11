import { type CrudGeneratorOptions, type CrudSingleGeneratorOptions } from "@comet/cms-api";
import { CLIHelper } from "@mikro-orm/cli";
import { type Dictionary, type EntityMetadata } from "@mikro-orm/postgresql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { watch } from "chokidar";
import { Command } from "commander";

import { generateCrud } from "./generate-crud";
import { generateCrudSingle } from "./generate-crud-single";
import { writeGeneratedFiles } from "./utils/write-generated-files";

type GenerateOptions = {
    watch: boolean;
};

const startFileWatchMode = async () => {
    watch("./src", {
        ignored: (path, stats) => {
            if (stats?.isFile()) {
                // Ignore files in generated directories
                return !!path.match(/\/generated\//);
            }
            return false;
        },
    })
        .on("add", async (path) => {})
        // TODO: debounce change event for path - currently this gets triggered twice or three times
        .on("change", async (path) => {
            const orm = await CLIHelper.getORM(undefined, undefined, {
                dbName: "generator",
                disableIdentityMap: true,
            });

            // TODO: unfortunately the metadata gets not updated when a file changes, currently unsure what
            const entities = orm.em.getMetadata().getAll();

            LazyMetadataStorage.load();

            const entity = entityForPath(entities, path);
            if (entity) {
                await generateCrudForEntity(entity);
            }

            await orm.close(true);
        })
        .on("error", (error) => {
            console.error(`Watcher error: ${error}`);
        });
};

const startGenerateAllFiles = async () => {
    const orm = await CLIHelper.getORM(undefined, undefined, {
        dbName: "generator",
        disableIdentityMap: true,
    });
    const entities = orm.em.getMetadata().getAll();
    LazyMetadataStorage.load();

    for (const name in entities) {
        const entity = entities[name];
        if (!entity.class) {
            // Ignore e.g. relation entities that don't have a class
            continue;
        }
        await generateCrudForEntity(entity);
    }

    await orm.close(true);
};

const generateCrudForEntity = async (entity: EntityMetadata) => {
    {
        const generatorOptions = Reflect.getMetadata(`data:crudGeneratorOptions`, entity.class) as CrudGeneratorOptions | undefined;
        if (generatorOptions) {
            console.log(`🚀 start generateCrud for Entity ${entity.path}`);
            const files = await generateCrud(generatorOptions, entity);
            await writeGeneratedFiles(files, { targetDirectory: generatorOptions.targetDirectory });
        }
    }
    {
        const generatorOptions = Reflect.getMetadata(`data:crudSingleGeneratorOptions`, entity.class) as CrudSingleGeneratorOptions | undefined;
        if (generatorOptions) {
            console.log(`🚀 start generateCrudSingle for Entity ${entity.path}`);
            const files = await generateCrudSingle(generatorOptions, entity);
            await writeGeneratedFiles(files, { targetDirectory: generatorOptions.targetDirectory });
        }
    }
};

const entityForPath = (entities: Dictionary<EntityMetadata>, path: string): EntityMetadata | null => {
    for (const name in entities) {
        const entity = entities[name];
        if (entity.path === `./${path}`) {
            return entity;
        }
    }
    return null;
};

const program = new Command();

const generate = new Command("generate")
    .action(async (options: GenerateOptions) => {
        if (options.watch) {
            console.log("🚀 Start API generator in watch mode ...");
            await startGenerateAllFiles();
            await startFileWatchMode();
        } else {
            console.log("🚀 Start API generator ...");
            startGenerateAllFiles();
        }
    })
    .option("--watch", "Watch for changes");

program.addCommand(generate);

program.parse(process.argv);
