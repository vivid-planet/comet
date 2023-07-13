import { Injectable, Type } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-custom";

import { CurrentUser } from "../current-user";
import { User } from "../dto/user";
import { UserPermissionsService } from "../user-permissions.service";

interface UserPermissionsStaticAuthedUserStrategyConfig {
    staticAuthedUser: User;
}

export function createUserPermissionsStaticAuthedUserStrategy(config: UserPermissionsStaticAuthedUserStrategyConfig): Type {
    @Injectable()
    class UserPermissionsStaticAuthedUserStrategy extends PassportStrategy(Strategy, "static-authed-user") {
        constructor(private userService: UserPermissionsService) {
            super();
        }

        async validate(): Promise<CurrentUser> {
            return this.userService.createCurrentUser(config.staticAuthedUser);
        }
    }
    return UserPermissionsStaticAuthedUserStrategy;
}
