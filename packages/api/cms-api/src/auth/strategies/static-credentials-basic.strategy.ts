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
            if (requiredUsername === "") throw new Error(`username for strategy ${strategyName} must no be empty`);
            if (requiredPassword === "") throw new Error(`password for strategy ${strategyName} must no be empty`);
            if (username === requiredUsername && password === requiredPassword) return strategyName;
        }
    }
    return StaticCredentialsBasicStrategy;
}
