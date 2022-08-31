import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Module, ModuleMetadata } from "@nestjs/common";

import { BUILDS_CONFIG, BUILDS_MODULE_OPTIONS } from "./builds.constants";
import { BuildsResolver } from "./builds.resolver";
import { BuildsService } from "./builds.service";
import { ChangesCheckerConsole } from "./changes-checker.console";
import { ChangesSinceLastBuild } from "./entities/changes-since-last-build.entity";
import { KubernetesService } from "./kubernetes.service";
import { SkipBuildInterceptor } from "./skip-build.interceptor";

export interface BuildsConfig {
    helmRelease: string;
}

interface BuildsModuleOptions {
    config: BuildsConfig;
}

interface BuildsModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFactory: (...args: any[]) => Promise<BuildsModuleOptions> | BuildsModuleOptions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inject?: any[];
}

@Module({})
export class BuildsModule {
    static registerAsync(options: BuildsModuleAsyncOptions): DynamicModule {
        const optionsProvider = {
            provide: BUILDS_MODULE_OPTIONS,
            ...options,
        };

        const publicUploadConfigProvider = {
            provide: BUILDS_CONFIG,
            useFactory: async (options: BuildsModuleOptions): Promise<BuildsConfig> => {
                return options.config;
            },
            inject: [BUILDS_MODULE_OPTIONS],
        };

        return {
            module: BuildsModule,
            imports: [...(options.imports ?? []), MikroOrmModule.forFeature([ChangesSinceLastBuild])],
            providers: [
                optionsProvider,
                publicUploadConfigProvider,
                KubernetesService,
                BuildsResolver,
                BuildsService,
                {
                    provide: "APP_INTERCEPTOR",
                    useClass: SkipBuildInterceptor,
                },
                ChangesCheckerConsole,
            ],
            exports: [BuildsService],
        };
    }
}
