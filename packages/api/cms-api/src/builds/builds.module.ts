import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module, ModuleMetadata } from "@nestjs/common";

import { CurrentUser } from "../auth/dto/current-user";
import { ContentScope } from "../common/decorators/content-scope.interface";
import { BuildTemplatesResolver } from "./build-templates.resolver";
import { BuildTemplatesService } from "./build-templates.service";
import { BUILDS_CONFIG, BUILDS_MODULE_OPTIONS } from "./builds.constants";
import { BuildsResolver } from "./builds.resolver";
import { BuildsService } from "./builds.service";
import { ChangesCheckerConsole } from "./changes-checker.console";
import { ChangesSinceLastBuild } from "./entities/changes-since-last-build.entity";
import { KubernetesService } from "./kubernetes.service";
import { SkipBuildInterceptor } from "./skip-build.interceptor";

export interface BuildsConfig {
    helmRelease: string;
    /** This allows to restirct certain users from accessing BuilderCronJobs or BuildJobs. */
    isContentScopeAllowed: (user: CurrentUser, contentScope?: ContentScope) => boolean;
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
@Global()
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
                BuildTemplatesResolver,
                BuildTemplatesService,
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
