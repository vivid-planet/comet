import {
    createAuthProxyJwtStrategy,
    createAuthResolver,
    createCometAuthGuard,
    createStaticAuthedUserStrategy,
    createStaticCredentialsBasicStrategy,
} from "@comet/cms-api";
import { DynamicModule, Module, Provider } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
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
            providers,
            exports: [AccessControlService, UserService],
        };
    }
}
