import { Injectable } from "@nestjs/common";
import { PassportStrategy, Type } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-custom";

import { UserPermissionsService } from "../..//user-permissions/user-permissions.service";
import { CurrentUser } from "../../user-permissions/dto/current-user";
import { User } from "../../user-permissions/interfaces/user";

interface StaticAuthedUserStrategyConfig {
    staticAuthedUser: User | string;
    userExtraData?: unknown;
}

export function createStaticAuthedUserStrategy(config: StaticAuthedUserStrategyConfig): Type {
    @Injectable()
    class StaticAuthedUserStrategy extends PassportStrategy(Strategy, "static-authed-user") {
        constructor(private readonly service: UserPermissionsService) {
            super();
        }

        async validate(request: Request): Promise<CurrentUser> {
            if (typeof config.staticAuthedUser === "string") {
                const user = await this.service.getUser(config.staticAuthedUser);
                return this.service.createCurrentUser(user, request);
            }
            return this.service.createCurrentUser(config.staticAuthedUser, request);
        }
    }
    return StaticAuthedUserStrategy;
}
