import { Injectable, Type } from "@nestjs/common";
import { JwtService, JwtVerifyOptions } from "@nestjs/jwt";
import { Request } from "express";
import JwksRsa, { JwksClient } from "jwks-rsa";

import { User } from "../../user-permissions/interfaces/user";
import { AuthenticateUserResult, AuthServiceInterface, SKIP_AUTH_SERVICE } from "../util/auth-service.interface";

type JwtPayload = { [key: string]: unknown };

export interface JwtAuthServiceOptions {
    jwksOptions?: JwksRsa.Options;
    verifyOptions?: JwtVerifyOptions;
    tokenHeaderName?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    convertJwtToUser?: (jwt: any) => Promise<User> | User;
}

export function createJwtAuthService({ jwksOptions, verifyOptions, ...options }: JwtAuthServiceOptions): Type<AuthServiceInterface> {
    @Injectable()
    class JwtAuthService implements AuthServiceInterface {
        private jwksClient?: JwksClient;

        constructor(private jwtService: JwtService) {
            if (jwksOptions) this.jwksClient = new JwksClient(jwksOptions);
        }

        async authenticateUser<T extends JwtPayload>(request: Request): Promise<AuthenticateUserResult> {
            const token = this.extractTokenFromRequest(request);
            if (!token) return SKIP_AUTH_SERVICE;

            if (this.jwksClient) {
                if (!verifyOptions) verifyOptions = {};
                verifyOptions.secret = await this.loadSecretFromJwks(token);
            }
            if (!verifyOptions?.secret) {
                throw new Error("secret or public key must be provided");
            }
            let jwt: T;
            try {
                jwt = await this.jwtService.verifyAsync<T>(token, verifyOptions);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
                if (e.name === "JsonWebTokenError" || e.name == "TokenExpiredError") {
                    return { authenticationError: e.message };
                }
                throw e;
            }

            if (options.convertJwtToUser) {
                return { user: await options.convertJwtToUser(jwt) };
            }

            if (typeof jwt.sub !== "string" || !jwt.sub) {
                return { authenticationError: "No sub found in JWT. Please implement `convertJwtToUser`" };
            }

            return { userId: jwt.sub };
        }

        private extractTokenFromRequest(request: Request): string | undefined {
            if (options.tokenHeaderName) {
                return request.header(options.tokenHeaderName);
            }
            const [type, token] = request.header("authorization")?.split(" ") ?? [];
            return type === "Bearer" ? token : undefined;
        }

        private async loadSecretFromJwks(token: string): Promise<string> {
            if (!this.jwksClient) throw new Error("jwksOptions.jwksUri not set");
            const jwt = this.jwtService.decode(token, { complete: true }) as { header: { kid: string } };
            return (await this.jwksClient.getSigningKey(jwt.header.kid)).getPublicKey();
        }
    }
    return JwtAuthService;
}
