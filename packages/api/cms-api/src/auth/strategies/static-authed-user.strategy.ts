import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import jwt from "jsonwebtoken";
import { ExtractJwt, Strategy } from "passport-jwt";

import { CurrentUserInterface } from "../current-user/current-user";

export interface StaticAuthedUserStrategyConfig {
    staticAuthedUser: CurrentUserInterface;
}

export const AUTH_STATIC_AUTHED_USER_STRATEGY_CONFIG = "auth-static-authed-user-strategy-config";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createStaticAuthedUserProvider = (value: StaticAuthedUserStrategyConfig) => ({
    provide: AUTH_STATIC_AUTHED_USER_STRATEGY_CONFIG,
    useValue: value,
});

@Injectable()
export class StaticAuthedUserStrategy extends PassportStrategy(Strategy, "static-authed-user") {
    constructor(@Inject(AUTH_STATIC_AUTHED_USER_STRATEGY_CONFIG) config: StaticAuthedUserStrategyConfig) {
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
