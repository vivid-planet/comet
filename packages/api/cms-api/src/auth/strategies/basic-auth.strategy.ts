import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { BasicStrategy } from "passport-http";

import { AUTH_MODULE_CONFIG } from "../auth.constants";
import { AuthModuleConfig } from "../auth.module";

@Injectable()
export class BasicAuthStrategy<CurrentUser> extends PassportStrategy(BasicStrategy, "basic") {
    constructor(@Inject(forwardRef(() => AUTH_MODULE_CONFIG)) private readonly config: AuthModuleConfig<CurrentUser>) {
        super();
    }

    async validate(username: string, password: string): Promise<boolean> {
        return username === "vivid" && password === this.config.apiPassword && this.config.apiPassword !== "";
    }
}
