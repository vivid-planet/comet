import { createAuthResolver, createCometAuthGuard, createStaticAuthedUserStrategy } from "@comet/cms-api";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { AccessControlService } from "./access-control.service";
import { staticUsers } from "./static-users";
import { UserService } from "./user.service";

@Module({
    providers: [
        createStaticAuthedUserStrategy({
            staticAuthedUser: staticUsers[0],
        }),
        createAuthResolver(),
        {
            provide: APP_GUARD,
            useClass: createCometAuthGuard(["static-authed-user"]),
        },
        UserService,
        AccessControlService,
    ],
    exports: [UserService, AccessControlService],
})
export class AuthModule {}
