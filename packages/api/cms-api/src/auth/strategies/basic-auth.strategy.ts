import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { BasicStrategy } from "passport-http";

import { BASIC_AUTH_CONFIG } from "../auth.constants";
import { BasicAuthConfig } from "../auth.module";

@Injectable()
export class BasicAuthStrategy extends PassportStrategy(BasicStrategy) {
    constructor(@Inject(forwardRef(() => BASIC_AUTH_CONFIG)) private readonly config: BasicAuthConfig) {
        super();
    }

    async validate(username: string, password: string): Promise<boolean> {
        return username === "vivid" && password === this.config.apiPassword;
    }
}
