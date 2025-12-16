import { CometAuthGuard, createAuthGuardProviders, createAuthResolver, createBasicAuthService, createJwtAuthService } from "@comet/cms-api";
import { DynamicModule, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { Config } from "@src/config/config";
import { AsyncLocalStorage } from "async_hooks";

import { AccessControlService } from "./access-control.service";
import { UserService } from "./user.service";

export const SYSTEM_USER_NAME = "system-user";

@Module({})
export class AuthModule {
    static forRoot(config: Config): DynamicModule {
        return {
            module: AuthModule,
            imports: [JwtModule],
            providers: [
                {
                    provide: AsyncLocalStorage,
                    useValue: new AsyncLocalStorage<{ tenantId?: string }>(),
                },
                createAuthResolver({
                    postLogoutRedirectUri: config.auth.postLogoutRedirectUri,
                    endSessionEndpoint: config.auth.idpEndSessionEndpoint,
                }),
                UserService,
                AccessControlService,
                {
                    provide: APP_GUARD,
                    useClass: CometAuthGuard,
                },
                ...createAuthGuardProviders(
                    ...[
                        createBasicAuthService({
                            username: SYSTEM_USER_NAME,
                            password: config.auth.systemUserPassword,
                        }),
                        createJwtAuthService({
                            verifyOptions: {
                                audience: config.auth.idpClientId,
                            },
                            jwksOptions: {
                                jwksUri: config.auth.idpJwksUri,
                            },
                            convertJwtToUser: (jwt) => ({
                                id: jwt.sub,
                                name: jwt.name,
                                email: jwt.email,
                                isAdmin: jwt.isAdmin,
                            }),
                        }),
                    ],
                ),
            ],
            exports: [AccessControlService, UserService, AsyncLocalStorage],
        };
    }
}
