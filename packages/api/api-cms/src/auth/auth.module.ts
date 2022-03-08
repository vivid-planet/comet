import { DynamicModule, Module, ModuleMetadata } from "@nestjs/common";

import { AUTH_CONFIG, AUTH_MODULE_OPTIONS } from "./auth.constants";
import { BasicAuthStrategy } from "./strategies/basic-auth.strategy";
import { BearerTokenStrategy } from "./strategies/bearer-token.strategy";

interface IdpConfig {
    url: string;
    password: string;
    clientId: string;
}

export interface AuthConfig {
    apiPassword: string;
    idpConfig: IdpConfig;
}

interface AuthModuleOptions {
    config: AuthConfig;
}

interface AuthModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFactory: (...args: any[]) => Promise<AuthModuleOptions> | AuthModuleOptions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inject?: any[];
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
            providers: [optionsProvider, authConfigProvider, BearerTokenStrategy, BasicAuthStrategy],
        };
    }
}
