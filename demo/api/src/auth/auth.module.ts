import {
    createAuthResolver,
    createCometAuthGuard,
    createUserPermissionsStaticAuthedUserStrategy,
    CurrentUser,
    User,
    UserStatus,
} from "@comet/cms-api";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

export const staticUsers: User[] = [
    {
        id: "1",
        name: "Admin",
        email: "demo@comet-dxp.com",
        language: "en",
        status: UserStatus.ACTIVE,
    },
    {
        id: "2",
        name: "Non-Admin",
        email: "test@test.com",
        language: "en",
        status: UserStatus.ACTIVE,
    },
];

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
