import { Inject, Injectable, Optional } from "@nestjs/common";
import { PassportStrategy, Type } from "@nestjs/passport";
import { JwtPayload } from "jsonwebtoken";
import { passportJwtSecret } from "jwks-rsa";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";

import { CurrentUserInterface } from "../current-user/current-user";
import { CURRENT_USER_LOADER, CurrentUserLoaderInterface } from "../current-user/current-user-loader";

interface AuthProxyJwtStrategyConfig {
    jwksUri: string;
    strategyName?: string;
    audience?: string;
    strategyOptions?: Omit<StrategyOptions, "jwtFromRequest">;
}

export function createAuthProxyJwtStrategy({
    jwksUri,
    audience,
    strategyOptions,
    strategyName = "auth-proxy-jwt",
}: AuthProxyJwtStrategyConfig): Type {
    @Injectable()
    class AuthProxyJwtStrategy extends PassportStrategy(Strategy, strategyName) {
        constructor(@Optional() @Inject(CURRENT_USER_LOADER) private readonly currentUserLoader: CurrentUserLoaderInterface) {
            super({
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKeyProvider: passportJwtSecret({
                    jwksUri,
                }),
                audience,
                ...strategyOptions,
            });
        }

        async validate(data: JwtPayload): Promise<CurrentUserInterface> {
            if (!data.sub) throw new Error("JwtPayload does not contain sub.");
            if (!this.currentUserLoader) {
                return {
                    id: data.sub,
                    name: data.name,
                    email: data.email,
                    language: data.language,
                };
            }
            return this.currentUserLoader.load(data.sub, data);
        }
    }
    return AuthProxyJwtStrategy;
}
