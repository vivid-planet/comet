import { createAuthResolver, createCometAuthGuard, createStaticAuthedUserStrategy } from "@comet/cms-api";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { CurrentUser } from "./current-user";
import { UserService } from "./user.service";

@Module({
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
        }),
        {
            provide: APP_GUARD,
            useClass: createCometAuthGuard(["static-authed-user"]),
        },
        UserService,
    ],
    exports: [UserService],
})
export class AuthModule {}
