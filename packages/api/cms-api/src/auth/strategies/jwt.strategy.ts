import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { passportJwtSecret } from "jwks-rsa";
import { ExtractJwt, Strategy } from "passport-jwt";

import { AUTH_CURRENT_USER_SERVICE, JWT_CONFIG } from "../auth.constants";
import { JwtConfig } from "../auth.module";
import { CurrentUser } from "../dto/current-user.dto";
import { CurrentUserService } from "../interfaces/current-user-service.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(
        @Inject(forwardRef(() => JWT_CONFIG)) config: JwtConfig,
        @Inject(AUTH_CURRENT_USER_SERVICE) private readonly currentUserService: CurrentUserService,
    ) {
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
        return this.currentUserService.loadUser(data);
    }
}
