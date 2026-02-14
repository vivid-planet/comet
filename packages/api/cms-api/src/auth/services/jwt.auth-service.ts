import { Injectable, Type } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { JwtService, JwtVerifyOptions } from "@nestjs/jwt";
import { Request } from "express";
import JwksRsa, { JwksClient } from "jwks-rsa";

import { isInjectableService } from "../../common/helper/is-injectable-service.helper";
import { User } from "../../user-permissions/interfaces/user";
import { AuthenticateUserResult, AuthServiceInterface, SKIP_AUTH_SERVICE } from "../util/auth-service.interface";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JwtPayload = { [key: string]: any };

type ConvertJwtToUser = (jwt: JwtPayload) => Promise<User> | User;

export interface JwtToUserServiceInterface {
    convertJwtToUser: ConvertJwtToUser;
}

export interface JwtAuthServiceOptions {
    jwksOptions?: JwksRsa.Options;
    verifyOptions?: JwtVerifyOptions;
    tokenHeaderName?: string;
    convertJwtToUser?: ConvertJwtToUser | Type<JwtToUserServiceInterface>;
}

export function createJwtAuthService({ jwksOptions, verifyOptions, ...options }: JwtAuthServiceOptions): Type<AuthServiceInterface> {
    @Injectable()
    class JwtAuthService implements AuthServiceInterface {
        private jwksClient?: JwksClient;

        constructor(
            private jwtService: JwtService,
            private readonly moduleRef: ModuleRef,
        ) {
            if (jwksOptions) {
                this.jwksClient = new JwksClient(jwksOptions);
            }
        }

        async authenticateUser<T extends JwtPayload>(request: Request): Promise<AuthenticateUserResult> {
            const token = this.extractTokenFromRequest(request);
            if (!token) {
                return SKIP_AUTH_SERVICE;
            }

            if (this.jwksClient) {
                if (!verifyOptions) {
                    verifyOptions = {};
                }
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
                if (isInjectableService(options.convertJwtToUser)) {
                    const service = this.moduleRef.get(options.convertJwtToUser, { strict: false });
                    return { user: await service.convertJwtToUser(jwt) };
                }
                return { user: await options.convertJwtToUser(jwt) };
            }

            if (typeof jwt.sub !== "string" || !jwt.sub) {
                return { authenticationError: "No sub found in JWT. Please implement `convertJwtToUser`" };
            }

            if (typeof jwt.name === "string" && typeof jwt.email === "string") {
                return { user: { id: jwt.sub, name: jwt.name, email: jwt.email } };
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
            if (!this.jwksClient) {
                throw new Error("jwksOptions.jwksUri not set");
            }
            const jwt = this.jwtService.decode(token, { complete: true }) as { header: { kid: string } };
            return (await this.jwksClient.getSigningKey(jwt.header.kid)).getPublicKey();
        }
    }
    return JwtAuthService;
}
