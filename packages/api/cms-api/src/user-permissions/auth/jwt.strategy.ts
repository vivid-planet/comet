import { Injectable, Type } from "@nestjs/common";

import { AuthProxyJwtStrategyConfig, createAuthProxyJwtStrategy } from "../../auth/strategies/auth-proxy-jwt.strategy";
import { CurrentUser } from "../dto/current-user";
import { UserPermissionsService } from "../user-permissions.service";

export function createUserPermissionsJwtStrategy(config: AuthProxyJwtStrategyConfig): Type {
    @Injectable()
    class UserPermissionsJwtStrategy extends createAuthProxyJwtStrategy(config) {
        constructor(private userService: UserPermissionsService) {
            super();
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async validate(data: any): Promise<CurrentUser> {
            return this.userService.createCurrentUser(await this.userService.getUser(data.sub));
        }
    }
    return UserPermissionsJwtStrategy;
}
