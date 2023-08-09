import { Injectable, Type } from "@nestjs/common";

import { createStaticAuthedUserStrategy } from "../../auth/strategies/static-authed-user.strategy";
import { CurrentUser } from "../dto/current-user";
import { User } from "../dto/user";
import { UserPermissionsService } from "../user-permissions.service";

interface UserPermissionsStaticAuthedUserStrategyConfig {
    staticAuthedUser: User;
}

export function createUserPermissionsStaticAuthedUserStrategy(config: UserPermissionsStaticAuthedUserStrategyConfig): Type {
    @Injectable()
    class UserPermissionsStaticAuthedUserStrategy extends createStaticAuthedUserStrategy(config) {
        constructor(private userService: UserPermissionsService) {
            super();
        }

        async validate(): Promise<CurrentUser> {
            return this.userService.createCurrentUser(config.staticAuthedUser);
        }
    }
    return UserPermissionsStaticAuthedUserStrategy;
}
