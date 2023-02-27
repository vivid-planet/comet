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
        async validate(username: string, password: string): Promise<boolean> {
            return username === config.username && password === config.password;
        }
    }
    return StaticCredentialsBasicStrategy;
}
