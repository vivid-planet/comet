import { Injectable } from "@nestjs/common";
import { PassportStrategy, Type } from "@nestjs/passport";
import { passportJwtSecret } from "jwks-rsa";
import { ExtractJwt, Strategy } from "passport-jwt";

import { CurrentUserInterface, CurrentUserLoaderInterface } from "../current-user/current-user";

interface AuthProxyJwtStrategyConfig {
    jwksUri: string;
}

@Injectable()
export class AuthProxyJwtStrategy extends PassportStrategy(Strategy, "auth-proxy-jwt") {
    constructor(config: AuthProxyJwtStrategyConfig) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKeyProvider: passportJwtSecret({
                jwksUri: config.jwksUri,
            }),
            ignoreExpiration: true, // https://github.com/oauth2-proxy/oauth2-proxy/issues/1836
        });
    }
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

export function createAuthProxyJwtStrategy(config: AuthProxyJwtStrategyConfig & { currentUserLoader?: CurrentUserLoaderInterface }): Type {
    @Injectable()
    class Strategy extends AuthProxyJwtStrategy {
        constructor() {
            super({ jwksUri: config.jwksUri });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async validate(data: any): Promise<CurrentUserInterface> {
            const userLoader = config.currentUserLoader ? config.currentUserLoader : new CurrentUserLoader();
            return userLoader.load(data);
        }
    }
    return Strategy;
}
