import { DynamicModule, Global, Module, ModuleMetadata } from "@nestjs/common";

import { BlockMigrateService } from "./block-migrate.service";
import { BLOCKS_MODULE_OPTIONS, BLOCKS_MODULE_TRANSFORMER_DEPENDENCIES } from "./blocks.constants";
import { BlocksMetaService } from "./blocks-meta.service";
import { BlocksTransformerService } from "./blocks-transformer.service";
import { CommandsService } from "./commands.service";

export interface BlocksModuleOptions {
    transformerDependencies: Record<string, unknown>;
}

export interface BlocksModuleSyncOptions extends Pick<ModuleMetadata, "imports"> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFactory: (...args: any[]) => BlocksModuleOptions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inject?: any[];
}

@Global()
@Module({})
export class BlocksModule {
    static forRoot(options: BlocksModuleSyncOptions): DynamicModule {
        const optionsProvider = {
            provide: BLOCKS_MODULE_OPTIONS,
            ...options,
        };

        const transformerDependenciesProvider = {
            provide: BLOCKS_MODULE_TRANSFORMER_DEPENDENCIES,
            useFactory: (options: BlocksModuleOptions): Record<string, unknown> => {
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
                CommandsService,
                BlockMigrateService,
            ],
            exports: [BlocksTransformerService, BLOCKS_MODULE_TRANSFORMER_DEPENDENCIES],
        };
    }
}
