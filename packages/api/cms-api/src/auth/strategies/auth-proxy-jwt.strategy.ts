import { Injectable } from "@nestjs/common";
import { PassportStrategy, Type } from "@nestjs/passport";
import { passportJwtSecret } from "jwks-rsa";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";

import { CurrentUserInterface, CurrentUserLoaderInterface } from "../current-user/current-user";

interface AuthProxyJwtStrategyConfig {
    jwksUri: string;
    currentUserLoader?: CurrentUserLoaderInterface;
    strategyName?: string;
    audience?: string;
    strategyOptions?: Omit<StrategyOptions, "jwtFromRequest">;
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

export function createAuthProxyJwtStrategy({
    jwksUri,
    audience,
    currentUserLoader,
    strategyOptions,
    strategyName = "auth-proxy-jwt",
}: AuthProxyJwtStrategyConfig): Type {
    @Injectable()
    class AuthProxyJwtStrategy extends PassportStrategy(Strategy, strategyName) {
        constructor() {
            super({
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKeyProvider: passportJwtSecret({
                    jwksUri,
                }),
                audience,
                ...strategyOptions,
            });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async validate(data: any): Promise<CurrentUserInterface> {
            const userLoader = currentUserLoader ? currentUserLoader : new CurrentUserLoader();
            return userLoader.load(data);
        }
    }
    return AuthProxyJwtStrategy;
}
