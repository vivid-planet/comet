import { DynamicModule, Module, ModuleMetadata, Provider, Type } from "@nestjs/common";
import { Issuer } from "openid-client";

import {
    AUTH_CURRENT_USER_LOADER,
    AUTH_CURRENT_USER_SERVICE,
    AUTH_MODULE_OPTIONS,
    BASIC_AUTH_CONFIG,
    BEARER_TOKEN_CONFIG,
    JWT_CONFIG,
} from "./auth.constants";
import { createAuthResolver } from "./auth.resolver";
import { DefaultCurrentUserLoaderService } from "./default-current-user-loader.service";
import { CurrentUser as CurrentUserDto } from "./dto/current-user.dto";
import { CurrentUserLoaderInterface } from "./interfaces/current-user-loader.interface";
import { CurrentUserService } from "./interfaces/current-user-service.interface";
import { BasicAuthStrategy } from "./strategies/basic-auth.strategy";
import { BearerTokenStrategy } from "./strategies/bearer-token.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";

export interface BasicAuthConfig {
    apiPassword: string;
}
export interface BearerTokenConfig {
    idpConfig: {
        url: string;
        password: string;
        clientId: string;
    };
}

export interface JwtConfig {
    jwksUri: string;
    endSessionEndpoint: string | undefined;
    postLogoutRedirectUri: string | undefined;
}

interface AuthModuleConfig {
    config: BearerTokenConfig & BasicAuthConfig;
}

interface AuthModuleJwtConfig {
    idpUrl: string;
    postLogoutRedirectUri: string;
    apiPassword: string;
}

interface AuthModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
    readonly authProvider?: "idp";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFactory: (...args: any[]) => Promise<AuthModuleConfig> | AuthModuleConfig;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inject?: any[];
    currentUserLoaderService?: Type<CurrentUserLoaderInterface>;
}

interface AuthModuleJwtOptions extends Pick<ModuleMetadata, "imports"> {
    readonly authProvider: "jwt";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFactory: (...args: any[]) => Promise<AuthModuleJwtConfig> | AuthModuleJwtConfig;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inject?: any[];
    currentUserService: Type<CurrentUserService>;
    CurrentUser: Type<CurrentUserDto>;
}

@Module({})
export class AuthModule {
    static registerAsync(options: AuthModuleAsyncOptions | AuthModuleJwtOptions): DynamicModule {
        const providers: Provider[] = [
            {
                provide: AUTH_MODULE_OPTIONS,
                ...options,
            },
        ];

        if (!options.authProvider) {
            providers.push(
                {
                    provide: AUTH_CURRENT_USER_LOADER,
                    useClass: options.currentUserLoaderService ?? DefaultCurrentUserLoaderService,
                },
                {
                    provide: BASIC_AUTH_CONFIG,
                    useFactory: async (options: AuthModuleConfig): Promise<BasicAuthConfig> => {
                        return {
                            apiPassword: options.config.apiPassword,
                        };
                    },
                    inject: [AUTH_MODULE_OPTIONS],
                },
                {
                    provide: BEARER_TOKEN_CONFIG,
                    useFactory: async (options: AuthModuleConfig): Promise<BearerTokenConfig> => {
                        return options.config;
                    },
                    inject: [AUTH_MODULE_OPTIONS],
                },
                BasicAuthStrategy,
                BearerTokenStrategy,
            );
        }

        if (options.authProvider === "jwt") {
            providers.push(
                {
                    provide: AUTH_CURRENT_USER_SERVICE,
                    useClass: options.currentUserService,
                },
                {
                    provide: BASIC_AUTH_CONFIG,
                    useFactory: async (options: AuthModuleJwtConfig): Promise<BasicAuthConfig> => {
                        return {
                            apiPassword: options.apiPassword,
                        };
                    },
                    inject: [AUTH_MODULE_OPTIONS],
                },
                {
                    provide: JWT_CONFIG,
                    useFactory: async (options: AuthModuleJwtConfig): Promise<JwtConfig> => {
                        const issuer = await Issuer.discover(options.idpUrl);
                        if (!issuer.metadata.jwks_uri) {
                            throw new Error(`Cannot get JWKS-URI from ${options.idpUrl}`);
                        }
                        return {
                            jwksUri: issuer.metadata.jwks_uri,
                            endSessionEndpoint: issuer.metadata.end_session_endpoint,
                            postLogoutRedirectUri: options.postLogoutRedirectUri,
                        };
                    },
                    inject: [AUTH_MODULE_OPTIONS],
                },
                JwtStrategy,
                BasicAuthStrategy,
                createAuthResolver(options.CurrentUser ? options.CurrentUser : CurrentUserDto),
            );
        }

        return {
            module: AuthModule,
            imports: options.imports ?? [],
            providers,
        };
    }
}
