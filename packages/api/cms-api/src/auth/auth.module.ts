import { DynamicModule, Module, ModuleMetadata, Type } from "@nestjs/common";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";

import { AUTH_CONFIG, AUTH_MODULE_CONFIG } from "./auth.constants";
import { createAuthResolver } from "./auth.resolver";
import { CurrentUserInterface } from "./current-user/current-user";
import { CurrentUserJwtLoader, CurrentUserLoaderInterface, CurrentUserStaticLoader } from "./current-user/current-user-loader";
import { BasicAuthStrategy } from "./strategies/basic-auth.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";

export interface AuthConfig<CurrentUser> {
    jwksUri?: string;
    endSessionEndpoint?: string;
    staticAuthedUserJwt?: string;
    currentUserLoader: CurrentUserLoaderInterface<CurrentUser>;
}

export interface AuthModuleConfig<CurrentUser> {
    idpUrl?: string;
    postLogoutRedirectUri?: string;
    staticAuthedUser?: CurrentUser;
    apiPassword: string;
}

export interface AuthModuleOptions<CurrentUser extends CurrentUserInterface> extends Pick<ModuleMetadata, "imports"> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFactory: (...args: any[]) => Promise<AuthModuleConfig<CurrentUser>> | AuthModuleConfig<CurrentUser>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inject?: any[];
    currentUserLoader?: CurrentUserLoaderInterface<CurrentUser>;
    currentUserDto: Type<CurrentUser>;
}

@Module({})
export class AuthModule {
    static register<CurrentUser extends CurrentUserInterface>(options: AuthModuleOptions<CurrentUser>): DynamicModule {
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
                    useFactory: async (config: AuthModuleConfig<CurrentUser>): Promise<AuthConfig<CurrentUser>> => {
                        if (config.staticAuthedUser) {
                            return {
                                staticAuthedUserJwt: jwt.sign(config.staticAuthedUser, "static"),
                                currentUserLoader: options.currentUserLoader ?? new CurrentUserStaticLoader<CurrentUser>(),
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
                                currentUserLoader: options.currentUserLoader ?? new CurrentUserJwtLoader<CurrentUser>(),
                            };
                        }
                    },
                    inject: [AUTH_MODULE_CONFIG],
                },
                JwtStrategy<CurrentUser>,
                BasicAuthStrategy<CurrentUser>,
                createAuthResolver<CurrentUser>(options.currentUserDto),
            ],
        };
    }
}
