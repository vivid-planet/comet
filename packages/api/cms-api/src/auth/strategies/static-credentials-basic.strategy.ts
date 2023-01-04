import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { BasicStrategy } from "passport-http";

export interface StaticCredentialsBasicStrategyConfig {
    username: string;
    password: string;
}

export const AUTH_STATIC_CREDENTIALS_BASIC_STRATEGY_CONFIG = "auth-static-credentials-basic-strategy-config";

@Injectable()
export class StaticCredentialsBasicStrategy extends PassportStrategy(BasicStrategy, "static-credentials-basic") {
    constructor(@Inject(AUTH_STATIC_CREDENTIALS_BASIC_STRATEGY_CONFIG) private readonly config: StaticCredentialsBasicStrategyConfig) {
        super();
    }

    async validate(username: string, password: string): Promise<boolean> {
        if (this.config.username === "") throw new Error("username for StaticCredentialsBasicStrategy must no be empty");
        if (this.config.password === "") throw new Error("password for StaticCredentialsBasicStrategy must no be empty");
        return username === this.config.username && password === this.config.password;
    }
}
