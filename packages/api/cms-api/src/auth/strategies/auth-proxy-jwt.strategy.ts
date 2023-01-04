import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { passportJwtSecret } from "jwks-rsa";
import { ExtractJwt, Strategy } from "passport-jwt";

import { CurrentUserInterface, CurrentUserLoaderInterface } from "../current-user/current-user";

export interface AuthProxyJwtStrategyConfig {
    jwksUri: string;
    currentUserLoader?: CurrentUserLoaderInterface;
}

class CurrentUserLoader implements CurrentUserLoaderInterface {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async load(data: any): Promise<CurrentUserInterface> {
        return {
            id: data.sub,
            name: data.name,
            email: data.email,
            language: data.language,
            role: data.ext?.role,
            rights: data.ext?.rights,
        };
    }
}

export const AUTH_AUTH_PROXY_JWT_STRATEGY_CONFIG = "auth-static-credentials-basic-strategy-config";

@Injectable()
export class AuthProxyJwtStrategy extends PassportStrategy(Strategy, "auth-proxy-jwt") {
    constructor(@Inject(AUTH_AUTH_PROXY_JWT_STRATEGY_CONFIG) private readonly config: AuthProxyJwtStrategyConfig) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKeyProvider: passportJwtSecret({
                jwksUri: config.jwksUri,
            }),
            ignoreExpiration: true, // https://github.com/oauth2-proxy/oauth2-proxy/issues/1836
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async validate(data: any): Promise<CurrentUserInterface> {
        const userLoader = this.config.currentUserLoader ? this.config.currentUserLoader : new CurrentUserLoader();
        return userLoader.load(data);
    }
}
