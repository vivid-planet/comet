import {
    AUTH_RESOLVER_CONFIG,
    AUTH_STATIC_AUTHED_USER_STRATEGY_CONFIG,
    AuthResolverConfig,
    CometAuthGuard,
    createAuthResolver,
    StaticAuthedUserStrategy,
    StaticAuthedUserStrategyConfig,
} from "@comet/cms-api";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { CurrentUser } from "./current-user";

@Module({
    providers: [
        {
            provide: AUTH_STATIC_AUTHED_USER_STRATEGY_CONFIG,
            useValue: {
                staticAuthedUser: {
                    id: "1",
                    name: "Test Admin",
                    email: "demo@comet-dxp.com",
                    language: "en",
                    role: "admin",
                    domains: ["main"],
                },
            } as StaticAuthedUserStrategyConfig,
        },
        StaticAuthedUserStrategy,
        {
            provide: AUTH_RESOLVER_CONFIG,
            useValue: {} as AuthResolverConfig,
        },
        createAuthResolver(CurrentUser),
        {
            provide: APP_GUARD,
            useClass: CometAuthGuard(["static-authed-user"]),
        },
    ],
})
export class AuthModule {}
