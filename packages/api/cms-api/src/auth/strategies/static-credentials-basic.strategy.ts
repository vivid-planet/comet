import { Injectable } from "@nestjs/common";
import { PassportStrategy, Type } from "@nestjs/passport";
import { BasicStrategy } from "passport-http";

interface StaticCredentialsBasicStrategyConfig {
    username: string;
    password: string;
}

@Injectable()
export class StaticCredentialsBasicStrategy extends PassportStrategy(BasicStrategy, "static-credentials-basic") {
    static strategyName = "static-credentials-basic";
    constructor(private readonly config: StaticCredentialsBasicStrategyConfig) {
        super();
    }

    async validate(username: string, password: string): Promise<boolean> {
        if (this.config.username === "") throw new Error("username for StaticCredentialsBasicStrategy must no be empty");
        if (this.config.password === "") throw new Error("password for StaticCredentialsBasicStrategy must no be empty");
        return username === this.config.username && password === this.config.password;
    }
}

export function createStaticCredentialsBasicStrategy(config: StaticCredentialsBasicStrategyConfig): Type {
    @Injectable()
    class Strategy extends StaticCredentialsBasicStrategy {
        constructor() {
            super(config);
        }
    }
    return Strategy;
}
