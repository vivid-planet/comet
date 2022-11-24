import { DynamicModule, Module, ModuleMetadata, Provider, Type } from "@nestjs/common";
import fetch from "node-fetch";

import { AUTH_CONFIG, AUTH_CURRENT_USER_LOADER, AUTH_JWT_CONFIG } from "./auth.constants";
import { createAuthAuthedUserResolver, createAuthJwtResolver } from "./auth.resolver";
import { DefaultCurrentUserLoaderService } from "./default-current-user-loader.service";
import { CurrentUserInterface } from "./dto/current-user";
import { CurrentUserLoaderInterface } from "./interfaces/current-user-loader.interface";
import { AuthedUserStrategy } from "./strategies/authed-user.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";

export interface JwtConfig {
    jwksUri: string;
    endSessionEndpoint?: string;
    postLogoutRedirectUri?: string;
}

interface AuthModuleJwtConfig {
    idpUrl: string;
    postLogoutRedirectUri?: string;
}

export interface AuthedUserConfig<CurrentUser> {
    authedUser: CurrentUser;
}

export interface AuthModuleAuthedUserOptions<CurrentUser extends CurrentUserInterface> extends Pick<ModuleMetadata, "imports"> {
    readonly strategy: "authedUser";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFactory: (...args: any[]) => Promise<AuthedUserConfig<CurrentUser>> | AuthedUserConfig<CurrentUser>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inject?: any[];
    currentUserDto: Type<CurrentUser>;
}

export interface AuthModuleJwtOptions<CurrentUser extends CurrentUserInterface> extends Pick<ModuleMetadata, "imports"> {
    readonly strategy: "jwt";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFactory: (...args: any[]) => Promise<AuthModuleJwtConfig> | AuthModuleJwtConfig;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inject?: any[];
    currentUserLoaderService?: Type<CurrentUserLoaderInterface>;
    currentUserDto: Type<CurrentUser>;
}

@Module({})
export class AuthModule {
    static register<CurrentUser extends CurrentUserInterface>(
        options: AuthModuleAuthedUserOptions<CurrentUser> | AuthModuleJwtOptions<CurrentUser>,
    ): DynamicModule {
        const providers: Provider[] = [
            {
                provide: AUTH_CONFIG,
                ...options,
            },
        ];
        if (options.strategy === "authedUser") {
            providers.push(AuthedUserStrategy, createAuthAuthedUserResolver<CurrentUser>(options.currentUserDto));
        } else if (options.strategy === "jwt") {
            providers.push(
                {
                    provide: AUTH_CURRENT_USER_LOADER,
                    useClass: options.currentUserLoaderService ?? DefaultCurrentUserLoaderService,
                },
                {
                    provide: AUTH_JWT_CONFIG,
                    useFactory: async (options: AuthModuleJwtConfig): Promise<JwtConfig> => {
                        const uri = `${options.idpUrl}/.well-known/openid-configuration`;
                        const result = await fetch(uri);
                        const metadata = await result.json();
                        if (!metadata.jwks_uri) {
                            throw new Error(`Cannot get JWKS-URI from ${uri}`);
                        }
                        return {
                            jwksUri: metadata.jwks_uri,
                            endSessionEndpoint: metadata.end_session_endpoint,
                            postLogoutRedirectUri: options.postLogoutRedirectUri,
                        };
                    },
                    inject: [AUTH_CONFIG],
                },
                JwtStrategy,
                createAuthJwtResolver<CurrentUser>(options.currentUserDto),
            );
        }

        return {
            module: AuthModule,
            imports: options.imports ?? [],
            providers,
        };
    }
}
