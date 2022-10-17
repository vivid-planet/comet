import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { BasicStrategy } from "passport-http";

import { AUTH_CONFIG } from "../auth.constants";
import { AuthConfig } from "../auth.module";

@Injectable()
export class BasicAuthStrategy extends PassportStrategy(BasicStrategy) {
    constructor(@Inject(forwardRef(() => AUTH_CONFIG)) private readonly config: AuthConfig) {
        super();
    }

    async validate(username: string, password: string): Promise<boolean> {
        return username === "vivid" && password === this.config.apiPassword;
    }
}
