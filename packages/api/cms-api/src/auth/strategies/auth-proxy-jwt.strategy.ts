import { Injectable } from "@nestjs/common";
import { PassportStrategy, Type } from "@nestjs/passport";
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { passportJwtSecret } from "jwks-rsa";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";

import { CurrentUser } from "../../user-permissions/dto/current-user";
import { UserPermissionsService } from "../../user-permissions/user-permissions.service";

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
        constructor(private readonly service: UserPermissionsService) {
            super({
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKeyProvider: passportJwtSecret({
                    jwksUri,
                }),
                audience,
                ...strategyOptions,
                passReqToCallback: true,
            });
        }

        async validate(request: Request): Promise<CurrentUser> {
            let user;
            if (strategyOptions?.passReqToCallback) {
                user = await this.service.createUserFromIdToken(request);
            } else {
                const idTokenString = request.headers["authorization"]?.toString().split(" ")[1];
                if (!idTokenString) throw new Error("No authorization header provided");
                const idToken = JSON.parse(Buffer.from(idTokenString.split(".")[1], "base64").toString()) as JwtPayload;
                user = await this.service.createUserFromIdToken(idToken);
            }
            return this.service.createCurrentUser(user, request);
        }
    }
    return AuthProxyJwtStrategy;
}
