import { Injectable, Type, UnauthorizedException } from "@nestjs/common";
import { JwtService, JwtVerifyOptions } from "@nestjs/jwt";
import { Request } from "express";
import JwksRsa, { JwksClient } from "jwks-rsa";

import { User } from "../../user-permissions/interfaces/user";
import { AuthServiceInterface } from "../util/auth-service.interface";

type JwtPayload = { [key: string]: unknown };

export interface JwtAuthServiceOptions {
    jwksOptions?: JwksRsa.Options;
    verifyOptions?: JwtVerifyOptions;
    tokenHeaderName?: string;
    convertJwtToUser?: (jwt: JwtPayload) => Promise<User> | User;
}

export function createJwtAuthService({ jwksOptions, verifyOptions, ...options }: JwtAuthServiceOptions): Type<AuthServiceInterface> {
    @Injectable()
    class JwtAuthService implements AuthServiceInterface {
        private jwksClient?: JwksClient;

        constructor(private jwtService: JwtService) {
            if (jwksOptions) this.jwksClient = new JwksClient(jwksOptions);
        }

        async authenticateUser(request: Request) {
            const token = this.extractTokenFromRequest(request);
            if (!token) return;

            if (this.jwksClient) {
                if (!verifyOptions) verifyOptions = {};
                verifyOptions.secret = await this.loadSecretFromJwks(token);
            }
            let jwt: JwtPayload;
            if (!verifyOptions?.secret) {
                throw new Error("secret or public key must be provided");
            }
            try {
                jwt = await this.jwtService.verifyAsync(token, verifyOptions);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
                if (e.name === "JsonWebTokenError") {
                    throw new UnauthorizedException(e.message);
                }
                throw e;
            }

            if (typeof jwt.sub !== "string") throw new UnauthorizedException("No sub found in JWT. Please implement `convertJwtToUser`");
            return jwt.sub;
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
