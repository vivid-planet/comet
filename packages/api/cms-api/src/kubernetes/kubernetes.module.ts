import { DynamicModule, Global, Module, ModuleMetadata } from "@nestjs/common";

import { KUBERNETES_CONFIG, KUBERNETES_MODULE_OPTIONS } from "./kubernetes.constants";
import { KubernetesService } from "./kubernetes.service";

export interface KubernetesConfig {
    helmRelease: string;
}

interface KubernetesModuleOptions {
    config: KubernetesConfig;
}

interface KubernetesModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFactory: (...args: any[]) => Promise<KubernetesModuleOptions> | KubernetesModuleOptions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inject?: any[];
}

@Module({})
@Global()
export class KubernetesModule {
    static registerAsync(options: KubernetesModuleAsyncOptions): DynamicModule {
        const optionsProvider = {
            provide: KUBERNETES_MODULE_OPTIONS,
            ...options,
        };

        const kubernetesConfigProvider = {
            provide: KUBERNETES_CONFIG,
            useFactory: async (options: KubernetesModuleOptions): Promise<KubernetesConfig> => {
                return options.config;
            },
            inject: [KUBERNETES_MODULE_OPTIONS],
        };

        return {
            module: KubernetesModule,
            imports: [...(options.imports ?? [])],
            providers: [optionsProvider, kubernetesConfigProvider, KubernetesService],
            exports: [KubernetesService],
        };
    }
}
