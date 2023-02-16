import { DynamicModule, Global, Module, ModuleMetadata } from "@nestjs/common";

import { BlockIndexService } from "./block-index.service";
import { BlockMigrateService } from "./block-migrate.service";
import { BLOCKS_MODULE_OPTIONS, BLOCKS_MODULE_TRANSFORMER_DEPENDENCIES } from "./blocks.constants";
import { BlocksMetaService } from "./blocks-meta.service";
import { BlocksTransformerService } from "./blocks-transformer.service";
import { CommandsService } from "./commands.service";
import { DiscoverService } from "./discover.service";

export interface BlocksModuleFactoryOptions {
    transformerDependencies: Record<string, unknown>;
}

export interface BlocksModuleOptions extends Pick<ModuleMetadata, "imports"> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFactory: (...args: any[]) => BlocksModuleFactoryOptions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inject?: any[];
    withoutIndex?: boolean;
}

@Global()
@Module({})
export class BlocksModule {
    static forRoot(options: BlocksModuleOptions): DynamicModule {
        const optionsProvider = {
            provide: BLOCKS_MODULE_OPTIONS,
            ...options,
        };

        const transformerDependenciesProvider = {
            provide: BLOCKS_MODULE_TRANSFORMER_DEPENDENCIES,
            useFactory: (options: BlocksModuleFactoryOptions): Record<string, unknown> => {
                return options.transformerDependencies;
            },
            inject: [BLOCKS_MODULE_OPTIONS],
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
            exports: [BlocksTransformerService, BLOCKS_MODULE_TRANSFORMER_DEPENDENCIES, ...(!options.withoutIndex ? [BlockIndexService] : [])],
        };
    }
}
