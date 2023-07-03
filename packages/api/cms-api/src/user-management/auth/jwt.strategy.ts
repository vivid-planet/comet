import { Injectable, Type } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { passportJwtSecret } from "jwks-rsa";
import { Strategy } from "passport-custom";
import { ExtractJwt } from "passport-jwt";

import { CurrentUser } from "../current-user";
import { UserManagementService } from "../user-management.service";

interface UserManagementJwtStrategyConfig {
    jwksUri: string;
}

export function createUserManagementJwtStrategy(config: UserManagementJwtStrategyConfig): Type {
    @Injectable()
    class UserManagementJwtStrategy extends PassportStrategy(Strategy, "jwt") {
        constructor(private userService: UserManagementService) {
            super({
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKeyProvider: passportJwtSecret({
                    jwksUri: config.jwksUri,
                }),
                ignoreExpiration: true, // https://github.com/oauth2-proxy/oauth2-proxy/issues/1836
            });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async validate(data: any): Promise<CurrentUser> {
            return this.userService.createCurrentUser(await this.userService.getUser(data.sub));
        }
    }
    return UserManagementJwtStrategy;
}
