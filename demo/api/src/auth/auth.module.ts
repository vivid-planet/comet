import { createAuthResolver, createCometAuthGuard, createStaticAuthedUserStrategy, createStaticCredentialsBasicStrategy } from "@comet/cms-api";
import { DynamicModule, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { Config } from "@src/config/config";

import { AccessControlService } from "./access-control.service";
import { staticUsers } from "./static-users";
import { UserService } from "./user.service";

export const SYSTEM_USER_NAME = "system-user";

@Module({})
export class AuthModule {
    static forRoot(config: Config): DynamicModule {
        return {
            module: AuthModule,
            providers: [
                createStaticCredentialsBasicStrategy({
                    username: SYSTEM_USER_NAME,
                    password: config.auth.systemUserPassword,
                    strategyName: "system-user",
                }),
                createStaticAuthedUserStrategy({
                    staticAuthedUser: staticUsers[0],
                }),
                createAuthResolver(),
                {
                    provide: APP_GUARD,
                    useClass: createCometAuthGuard(["system-user", "static-authed-user"]),
                },
                UserService,
                AccessControlService,
            ],
            exports: [UserService, AccessControlService],
        };
    }
}
