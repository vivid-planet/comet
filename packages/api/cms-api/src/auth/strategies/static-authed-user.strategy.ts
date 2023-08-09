import { Injectable } from "@nestjs/common";
import { PassportStrategy, Type } from "@nestjs/passport";
import { Strategy } from "passport-custom";

import { CurrentUserInterface } from "../current-user/current-user";

export interface StaticAuthedUserStrategyConfig {
    staticAuthedUser: CurrentUserInterface;
}

export function createStaticAuthedUserStrategy(config: StaticAuthedUserStrategyConfig): Type {
    @Injectable()
    class StaticAuthedUserStrategy extends PassportStrategy(Strategy, "static-authed-user") {
        validate(): CurrentUserInterface {
            return config.staticAuthedUser;
        }
    }
    return StaticAuthedUserStrategy;
}
