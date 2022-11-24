import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-custom";

import { AUTH_CONFIG } from "../auth.constants";
import { AuthedUserConfig } from "../auth.module";

@Injectable()
export class AuthedUserStrategy<CurrentUser> extends PassportStrategy(Strategy, "authedUser") {
    constructor(@Inject(forwardRef(() => AUTH_CONFIG)) private config: AuthedUserConfig<CurrentUser>) {
        super();
    }

    validate(): CurrentUser {
        return this.config.authedUser;
    }
}
