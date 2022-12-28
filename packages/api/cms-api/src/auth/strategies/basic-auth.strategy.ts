import { Injectable } from "@nestjs/common";
import { PassportStrategy, Type } from "@nestjs/passport";
import { BasicStrategy } from "passport-http";

export interface AuthBasicAuthStrategyConfig {
    username?: string;
    password: string;
}

export function createBasicAuthStrategy(config: AuthBasicAuthStrategyConfig): Type {
    @Injectable()
    class BasicAuthStrategy extends PassportStrategy(BasicStrategy, "basic") {
        constructor() {
            super();
        }

        async validate(username: string, password: string): Promise<boolean> {
            if (config.password === "") throw new Error("password for BasicAuthStrategy must no be empty");
            const expectedUsername = config.username ? config.username : "vivid";
            return username === expectedUsername && password === config.password;
        }
    }
    return BasicAuthStrategy;
}
