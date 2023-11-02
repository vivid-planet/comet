import { createAuthResolver, createCometAuthGuard, createStaticAuthedUserStrategy } from "@comet/cms-api";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { AccessControlService } from "./access-control.service";
import { CurrentUser } from "./current-user";
import { staticUsers } from "./static-users";
import { UserService } from "./user.service";

@Module({
    providers: [
        createStaticAuthedUserStrategy({
            staticAuthedUser: staticUsers[0].id,
            userExtraData: { role: "admin", domains: ["main", "secondary"] }, // TODO Remove once they disappear from CurrentUserInterface
        }),
        createAuthResolver({
            currentUser: CurrentUser,
        }),
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
