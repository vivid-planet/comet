import { Injectable } from "@nestjs/common";
import { PassportStrategy, Type } from "@nestjs/passport";
import jwt from "jsonwebtoken";
import { ExtractJwt, Strategy } from "passport-jwt";

interface StaticAuthedUserStrategyConfig {
    userIdentifier: string;
}

export function createStaticAuthedLoadedUserStrategy(config: StaticAuthedUserStrategyConfig): Type {
    @Injectable()
    class StaticAuthedUserStrategy extends PassportStrategy(Strategy, "static-authed-user") {
        constructor() {
            const secretOrKey = "static";
            super({
                jwtFromRequest: ExtractJwt.fromExtractors([() => jwt.sign(config.userIdentifier, secretOrKey)]),
                secretOrKey,
            });
        }
    }
    return StaticAuthedUserStrategy;
}
