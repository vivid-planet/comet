import { createAuthResolver, createCometAuthGuard, createStaticAuthedUserStrategy } from "@comet/cms-api";
import { DynamicModule, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { Config } from "@src/config/config";

import { CurrentUser } from "./current-user";
import { UserService } from "./user.service";

@Module({})
export class AuthModule {
    static forRoot(config: Config): DynamicModule {
        return {
            module: AuthModule,
            providers: [
                createStaticAuthedUserStrategy({
                    staticAuthedUser: {
                        id: "1",
                        name: "Test Admin",
                        email: "demo@comet-dxp.com",
                        language: "en",
                        role: "admin",
                        domains: ["main", "secondary"],
                    },
                }),
                createAuthResolver({
                    currentUser: CurrentUser,
                    hmacSecret: config.hmacSecret,
                }),
                {
                    provide: APP_GUARD,
                    useClass: createCometAuthGuard(["static-authed-user"]),
                },
                UserService,
            ],
            exports: [UserService],
        };
    }
}
