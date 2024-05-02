import { Injectable } from "@nestjs/common";
import { PassportStrategy, Type } from "@nestjs/passport";
import { BasicStrategy } from "passport-http";

interface StaticCredentialsBasicStrategyConfig {
    username?: string;
    password: string;
    strategyName: string;
}

export function createStaticCredentialsBasicStrategy({
    username: requiredUsername = "comet",
    password: requiredPassword,
    strategyName,
}: StaticCredentialsBasicStrategyConfig): Type {
    @Injectable()
    class StaticCredentialsBasicStrategy extends PassportStrategy(BasicStrategy, strategyName) {
        constructor() {
            super();
        }

        validate(username: string, password: string): string | undefined {
            if (username === "") throw new Error("username for StaticCredentialsBasicStrategy must no be empty");
            if (password === "") throw new Error("password for StaticCredentialsBasicStrategy must no be empty");
            if (username === requiredUsername && password === requiredPassword) return strategyName;
        }
    }
    return StaticCredentialsBasicStrategy;
}
