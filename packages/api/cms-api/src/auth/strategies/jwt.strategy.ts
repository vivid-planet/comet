import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { passportJwtSecret } from "jwks-rsa";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";

import { AUTH_CONFIG } from "../auth.constants";
import { AuthConfig } from "../auth.module";
import { CurrentUserInterface } from "../current-user/current-user";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(@Inject(forwardRef(() => AUTH_CONFIG)) private readonly config: AuthConfig) {
        let strategyConfig: StrategyOptions;
        if (config.staticAuthedUserJwt) {
            strategyConfig = {
                jwtFromRequest: ExtractJwt.fromExtractors([() => config.staticAuthedUserJwt as string]),
                secretOrKey: "static",
            };
        } else if (config.jwksUri) {
            strategyConfig = {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKeyProvider: passportJwtSecret({
                    jwksUri: config.jwksUri,
                }),
                ignoreExpiration: true, // https://github.com/oauth2-proxy/oauth2-proxy/issues/1836
            };
        } else {
            throw new Error("Can neither find a static jwt nor a jwksUri");
        }
        super(strategyConfig);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async validate(data: any): Promise<CurrentUserInterface> {
        return this.config.currentUserLoader.load(data);
    }
}
