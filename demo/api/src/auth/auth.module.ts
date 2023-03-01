import { createAuthResolver, createCometAuthGuard } from "@comet/cms-api";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { AuthStrategy } from "./auth.strategy";
import { CurrentUser } from "./current-user";

@Module({
    providers: [
        AuthStrategy,
        createAuthResolver({
            currentUser: CurrentUser,
        }),
        {
            provide: APP_GUARD,
            useClass: createCometAuthGuard(["static-authed-user"]),
        },
    ],
})
export class AuthModule {}
