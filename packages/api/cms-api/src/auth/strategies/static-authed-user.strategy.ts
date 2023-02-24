import { Injectable } from "@nestjs/common";
import { PassportStrategy, Type } from "@nestjs/passport";
import jwt from "jsonwebtoken";
import { ExtractJwt, Strategy } from "passport-jwt";

import { CurrentUserInterface } from "../current-user/current-user";

interface StaticAuthedUserStrategyConfig {
    userIdentifier: string;
}

@Injectable()
export abstract class StaticAuthedUserStrategy extends PassportStrategy(Strategy, "static-authed-user") {
    constructor(config: StaticAuthedUserStrategyConfig) {
        const secretOrKey = "static";
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([() => jwt.sign(config.userIdentifier, secretOrKey)]),
            secretOrKey,
        });
    }
}

export function createStaticAuthedUserStrategy(config: { staticAuthedUser: CurrentUserInterface }): Type {
    @Injectable()
    class Strategy extends StaticAuthedUserStrategy {
        constructor() {
            super({ userIdentifier: "notUsed" });
        }
        validate(): CurrentUserInterface {
            return config.staticAuthedUser;
        }
    }
    return Strategy;
}
