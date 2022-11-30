import { DynamicModule, Module, ModuleMetadata, Type } from "@nestjs/common";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";

import { AUTH_CONFIG, AUTH_OPTIONS } from "./auth.constants";
import { createAuthResolver } from "./auth.resolver";
import { CurrentUserInterface } from "./current-user/current-user";
import { CurrentUserJwtLoader, CurrentUserLoaderInterface, CurrentUserStaticLoader } from "./current-user/current-user-loader";
import { JwtStrategy } from "./strategies/jwt.strategy";

export interface AuthConfig<CurrentUser> {
    postLogoutRedirectUri?: string;
    jwksUri?: string;
    endSessionEndpoint?: string;
    staticUserJwt?: string;
    currentUserLoader: CurrentUserLoaderInterface<CurrentUser>;
}

interface AuthModuleConfig<CurrentUser> {
    idpUrl?: string;
    postLogoutRedirectUri?: string;
    authedUser?: CurrentUser;
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
                    provide: AUTH_OPTIONS,
                    ...options,
                },
                {
                    provide: AUTH_CONFIG,
                    useFactory: async (config: AuthModuleConfig<CurrentUser>): Promise<AuthConfig<CurrentUser>> => {
                        if (config.authedUser) {
                            return {
                                staticUserJwt: jwt.sign(config.authedUser, "static"),
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
                    inject: [AUTH_OPTIONS],
                },
                JwtStrategy<CurrentUser>,
                createAuthResolver<CurrentUser>(options.currentUserDto),
            ],
        };
    }
}
