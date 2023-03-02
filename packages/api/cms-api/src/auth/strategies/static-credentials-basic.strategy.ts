import { Injectable } from "@nestjs/common";
import { PassportStrategy, Type } from "@nestjs/passport";
import { BasicStrategy } from "passport-http";

interface StaticCredentialsBasicStrategyConfig {
    username: string;
    password: string;
}

export function createStaticCredentialsBasicStrategy(config: StaticCredentialsBasicStrategyConfig): Type {
    @Injectable()
    class StaticCredentialsBasicStrategy extends PassportStrategy(BasicStrategy, "static-credentials-basic") {
        constructor() {
            super();
        }

        async validate(username: string, password: string): Promise<boolean> {
            if (config.username === "") throw new Error("username for StaticCredentialsBasicStrategy must no be empty");
            if (config.password === "") throw new Error("password for StaticCredentialsBasicStrategy must no be empty");
            return username === config.username && password === config.password;
        }
    }
    return StaticCredentialsBasicStrategy;
}
