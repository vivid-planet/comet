import { Inject, Injectable, Optional } from "@nestjs/common";
import { PassportStrategy, Type } from "@nestjs/passport";
import { JwtPayload } from "jsonwebtoken";
import { passportJwtSecret } from "jwks-rsa";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";

import { CurrentUserInterface } from "../current-user/current-user";
import { CURRENT_USER_LOADER, CurrentUserLoaderInterface } from "../current-user/current-user-loader";

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
        constructor(@Optional() @Inject(CURRENT_USER_LOADER) private readonly currentUserLoader: CurrentUserLoaderInterface) {
            super({
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKeyProvider: passportJwtSecret({
                    jwksUri,
                }),
                audience,
                ...strategyOptions,
            });
            if (!this.currentUserLoader) this.currentUserLoader = currentUserLoader ?? new CurrentUserLoader();
        }

        async validate(data: JwtPayload): Promise<CurrentUserInterface> {
            return this.currentUserLoader.load(data);
        }
    }
    return AuthProxyJwtStrategy;
}
