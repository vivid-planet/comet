import { Injectable } from "@nestjs/common";
import { PassportStrategy, Type } from "@nestjs/passport";
import jwt from "jsonwebtoken";
import { ExtractJwt, Strategy } from "passport-jwt";

import { CurrentUserInterface } from "../current-user/current-user";

interface StaticAuthedUserStrategyConfig {
    staticAuthedUser: CurrentUserInterface;
}

export function createStaticAuthedUserStrategy(config: StaticAuthedUserStrategyConfig): Type {
    @Injectable()
    class StaticAuthedUserStrategy extends PassportStrategy(Strategy, "static-authed-user") {
        constructor() {
            const secretOrKey = "static";
            super({
                jwtFromRequest: ExtractJwt.fromExtractors([() => jwt.sign(config.staticAuthedUser, secretOrKey)]),
                secretOrKey,
            });
        }

        validate(data: CurrentUserInterface): CurrentUserInterface {
            return data;
        }
    }
    return StaticAuthedUserStrategy;
}
