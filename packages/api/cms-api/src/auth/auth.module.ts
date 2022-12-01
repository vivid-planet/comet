import { DynamicModule, Module, ModuleMetadata, Type } from "@nestjs/common";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";

import { AUTH_CONFIG, AUTH_MODULE_CONFIG } from "./auth.constants";
import { createAuthResolver } from "./auth.resolver";
import { CurrentUserInterface } from "./current-user/current-user";
import { CurrentUserJwtLoader, CurrentUserLoaderInterface, CurrentUserStaticLoader } from "./current-user/current-user-loader";
import { BasicAuthStrategy } from "./strategies/basic-auth.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";

export interface AuthConfig {
    jwksUri?: string;
    endSessionEndpoint?: string;
    staticAuthedUserJwt?: string;
    currentUserLoader: CurrentUserLoaderInterface;
}

export interface AuthModuleConfig {
    idpUrl?: string;
    postLogoutRedirectUri?: string;
    staticAuthedUser?: CurrentUserInterface;
    apiPassword: string;
}

export interface AuthModuleOptions extends Pick<ModuleMetadata, "imports"> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFactory: (...args: any[]) => Promise<AuthModuleConfig> | AuthModuleConfig;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inject?: any[];
    currentUserLoader?: CurrentUserLoaderInterface;
    currentUser: Type<CurrentUserInterface>;
}

@Module({})
export class AuthModule {
    static register(options: AuthModuleOptions): DynamicModule {
        return {
            module: AuthModule,
            imports: options.imports ?? [],
            providers: [
                {
                    provide: AUTH_MODULE_CONFIG,
                    ...options,
                },
                {
                    provide: AUTH_CONFIG,
                    useFactory: async (config: AuthModuleConfig): Promise<AuthConfig> => {
                        if (config.staticAuthedUser) {
                            return {
                                staticAuthedUserJwt: jwt.sign(config.staticAuthedUser, "static"),
                                currentUserLoader: options.currentUserLoader ?? new CurrentUserStaticLoader(),
                            };
                        } else {
                            if (!config.idpUrl) throw new Error("idpUrl must be set");
                            const uri = `${config.idpUrl}/.well-known/openid-configuration`;
                            const result = await fetch(uri);
                            const metadata = await result.json();
                            if (!metadata.jwks_uri) {
                                throw new Error(`Cannot get JWKS-URI from ${uri}`);
                            }
                            return {
                                endSessionEndpoint: metadata.end_session_endpoint,
                                jwksUri: metadata.jwks_uri,
                                currentUserLoader: options.currentUserLoader ?? new CurrentUserJwtLoader(),
                            };
                        }
                    },
                    inject: [AUTH_MODULE_CONFIG],
                },
                JwtStrategy,
                BasicAuthStrategy,
                createAuthResolver(options.currentUser),
            ],
        };
    }
}
