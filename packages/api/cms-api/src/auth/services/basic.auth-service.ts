import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

import { AuthServiceInterface } from "../util/auth-service.interface";

interface BasicAuthServiceConfig {
    username: string;
    password: string;
}

export function createBasicAuthService({ username: requiredUsername, password: requiredPassword }: BasicAuthServiceConfig) {
    if (requiredUsername === "") throw new Error(`username for BasicAuthService must not be empty`);
    if (requiredPassword === "") throw new Error(`password for BasicAuthService (username "${requiredUsername}") must not be empty`);

    @Injectable()
    class BasicAuthService implements AuthServiceInterface {
        authenticateUser(request: Request) {
            const [type, token] = request.header("authorization")?.split(" ") ?? [];
            if (type !== "Basic") return;

            const [username, password] = Buffer.from(token, "base64").toString("ascii").split(":");
            if (username !== requiredUsername) return;

            if (password !== requiredPassword) throw new UnauthorizedException(`Wrong password for Basic Auth user "${username}".`);

            return username;
        }
    }
    return BasicAuthService;
}
