import {
<<<<<<< HEAD
    CometAuthGuard,
    createAuthGuardProviders,
    createAuthResolver,
    createBasicAuthService,
    createJwtAuthService,
    createSitePreviewAuthService,
    createStaticUserAuthService,
} from "@comet/cms-api";
import { DynamicModule, Module } from "@nestjs/common";
=======
    createAuthProxyJwtStrategy,
    createAuthResolver,
    createCometAuthGuard,
    createStaticAuthedUserStrategy,
    createStaticCredentialsBasicStrategy,
} from "@comet/cms-api";
import { DynamicModule, Module, Provider } from "@nestjs/common";
>>>>>>> main
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { Config } from "@src/config/config";

import { AccessControlService } from "./access-control.service";
import { staticUsers } from "./static-users";
import { UserService } from "./user.service";

export const SYSTEM_USER_NAME = "system-user";

@Module({})
export class AuthModule {
    static forRoot(config: Config): DynamicModule {
        const providers: Provider[] = [
            createStaticCredentialsBasicStrategy({
                username: SYSTEM_USER_NAME,
                password: config.auth.systemUserPassword,
                strategyName: "system-user",
            }),
            createAuthResolver({
                postLogoutRedirectUri: config.auth.postLogoutRedirectUri,
                endSessionEndpoint: config.auth.idpEndSessionEndpoint,
            }),
            AccessControlService,
            UserService,
        ];

        if (config.auth.useAuthProxy) {
            providers.push(
                createAuthProxyJwtStrategy({
                    audience: config.auth.idpClientId,
                    jwksUri: config.auth.idpJwksUri,
                }),
            );
            providers.push({
                provide: APP_GUARD,
                useClass: createCometAuthGuard(["auth-proxy-jwt", "system-user"]),
            });
        } else {
            if (process.env.NODE_ENV !== "development") {
                throw new Error("config.auth.useAuthproxy must only be false in development");
            }
            providers.push(
                createStaticAuthedUserStrategy({
                    staticAuthedUser: staticUsers[0].id,
                }),
            );
            providers.push({
                provide: APP_GUARD,
                useClass: createCometAuthGuard(["system-user", "static-authed-user"]),
            });
        }

        return {
            module: AuthModule,
<<<<<<< HEAD
            providers: [
                ...createAuthGuardProviders(
                    createBasicAuthService({
                        username: SYSTEM_USER_NAME,
                        password: config.auth.systemUserPassword,
                    }),
                    createJwtAuthService({ verifyOptions: { secret: "secret" } }), // for testing purposes, send header "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiaWF0IjoxNTE2MjM5MDIyfQ.fG9j2rVOgunoya_njgn9w1t8muFlrpE9ffJ9i8sJYsQ"
                    createSitePreviewAuthService({ sitePreviewSecret: config.sitePreviewSecret }),
                    createStaticUserAuthService({ staticUser: staticUsers[0] }),
                ),
                createAuthResolver(),
                {
                    provide: APP_GUARD,
                    useClass: CometAuthGuard,
                },
                UserService,
                AccessControlService,
            ],
            exports: [UserService, AccessControlService],
            imports: [JwtModule],
=======
            providers,
            exports: [AccessControlService, UserService],
>>>>>>> main
        };
    }
}
