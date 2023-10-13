import {
    createAuthResolver,
    createCometAuthGuard,
    createStaticAuthedUserStrategy,
    CURRENT_USER_LOADER,
    UserPermissionsCurrentUserLoader,
} from "@comet/cms-api";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { CurrentUser } from "./current-user";
import { staticUsers } from "./static-users";
import { UserService } from "./user.service";

@Module({
    providers: [
        {
            provide: CURRENT_USER_LOADER,
            useClass: UserPermissionsCurrentUserLoader,
        },
        createStaticAuthedUserStrategy({
            staticAuthedUser: { ...staticUsers[0], role: "admin", domains: ["main", "secondary"] }, // TODO Remove role and domain once they disappear from CurrentUserInterface
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
