import { Injectable, Type } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-custom";

import { CurrentUser } from "../current-user";
import { User } from "../dto/user";
import { UserManagementService } from "../user-management.service";

interface UserManagementStaticAuthedUserStrategyConfig {
    staticAuthedUser: User;
}

export function createUserManagementStaticAuthedUserStrategy(config: UserManagementStaticAuthedUserStrategyConfig): Type {
    @Injectable()
    class UserManagementStaticAuthedUserStrategy extends PassportStrategy(Strategy, "static-authed-user") {
        constructor(private userService: UserManagementService) {
            super();
        }

        async validate(): Promise<CurrentUser> {
            return this.userService.createCurrentUser(config.staticAuthedUser);
        }
    }
    return UserManagementStaticAuthedUserStrategy;
}
