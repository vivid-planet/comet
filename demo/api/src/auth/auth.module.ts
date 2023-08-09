import { createAuthResolver, createCometAuthGuard, createUserPermissionsStaticAuthedUserStrategy, CurrentUser } from "@comet/cms-api";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { staticUsers } from "@src/user-permission/config.service";

@Module({
    providers: [
        createUserPermissionsStaticAuthedUserStrategy({
            staticAuthedUser: staticUsers[0],
        }),
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
