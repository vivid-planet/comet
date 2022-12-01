import { DynamicModule, Module, ModuleMetadata, Type } from "@nestjs/common";

import { AUTH_CONFIG, AUTH_CURRENT_USER_LOADER, AUTH_MODULE_OPTIONS } from "./auth.constants";
import { DefaultCurrentUserLoaderService } from "./default-current-user-loader.service";
import { CurrentUserLoaderInterface } from "./interfaces/current-user-loader.interface";

//eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AuthConfig {}

interface AuthModuleOptions {
    config: AuthConfig;
}

interface AuthModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFactory: (...args: any[]) => Promise<AuthModuleOptions> | AuthModuleOptions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inject?: any[];
    currentUserLoaderService?: Type<CurrentUserLoaderInterface>;
}

@Module({})
export class AuthModule {
    static registerAsync(options: AuthModuleAsyncOptions): DynamicModule {
        const optionsProvider = {
            provide: AUTH_MODULE_OPTIONS,
            ...options,
        };

        const authConfigProvider = {
            provide: AUTH_CONFIG,
            useFactory: async (options: AuthModuleOptions): Promise<AuthConfig> => {
                return options.config;
            },
            inject: [AUTH_MODULE_OPTIONS],
        };
        return {
            module: AuthModule,
            imports: options.imports ?? [],
            providers: [
                optionsProvider,
                authConfigProvider,
                {
                    provide: AUTH_CURRENT_USER_LOADER,
                    useClass: options.currentUserLoaderService ?? DefaultCurrentUserLoaderService,
                },
            ],
        };
    }
}
