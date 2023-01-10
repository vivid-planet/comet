import { BaseEntity } from "@mikro-orm/core";
import { DynamicModule, Global, Module, ModuleMetadata } from "@nestjs/common";

import { DamModule } from "../dam/dam.module";
import { File } from "../dam/files/entities/file.entity";
import { FilesService } from "../dam/files/files.service";
import { BlockIndexService } from "./block-index.service";
import { BlockMigrateService } from "./block-migrate.service";
import { BLOCKS_MODULE_DEPENDENCY_TRANSFORMERS, BLOCKS_MODULE_OPTIONS } from "./blocks.constants";
import { BlocksMetaService } from "./blocks-meta.service";
import { BlocksTransformerService } from "./blocks-transformer.service";
import { CommandsService } from "./commands.service";
import { DiscoverService } from "./discover.service";

export interface BlocksModuleOptions {
    dependencyTransformers: DependencyTransformers;
}

export interface BlocksModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFactory: (...args: any[]) => Promise<BlocksModuleOptions> | BlocksModuleOptions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inject?: any[];
    withoutIndex?: boolean;
}

export interface DependencyTransformers {
    // Can return any entity
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: (id: string) => Promise<BaseEntity<any, any> | null>;
}

@Global()
@Module({})
export class BlocksModule {
    static forRootAsync(options: BlocksModuleAsyncOptions): DynamicModule {
        const optionsProvider = {
            provide: BLOCKS_MODULE_OPTIONS,
            ...options,
        };

        const transformerDependenciesProvider = {
            import: [DamModule],
            provide: BLOCKS_MODULE_DEPENDENCY_TRANSFORMERS,
            useFactory: async (options: BlocksModuleOptions, filesService: FilesService): Promise<DependencyTransformers> => {
                return {
                    ...options.dependencyTransformers,
                    [File.name]: (id: string): Promise<File | null> => {
                        return filesService.findOneById(id);
                    },
                };
            },
            inject: [BLOCKS_MODULE_OPTIONS, FilesService],
        };

        return {
            module: BlocksModule,
            imports: options.imports ?? [],
            providers: [
                optionsProvider,
                transformerDependenciesProvider,
                BlocksTransformerService,
                BlocksMetaService,
                ...(!options.withoutIndex ? [DiscoverService, BlockIndexService, CommandsService, BlockMigrateService] : []),
            ],
            exports: [BlocksTransformerService, ...(!options.withoutIndex ? [BlockIndexService] : [])],
        };
    }
}
