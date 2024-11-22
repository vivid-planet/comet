import { CometAuthGuard, createAuthGuardProviders, createAuthResolver, createBasicAuthService, createStaticUserAuthService } from "@comet/cms-api";
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
                ...createAuthGuardProviders(
                    createBasicAuthService({
                        username: SYSTEM_USER_NAME,
                        password: config.auth.systemUserPassword,
                    }),
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
        };
    }
}
