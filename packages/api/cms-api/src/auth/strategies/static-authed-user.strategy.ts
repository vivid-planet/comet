import { Inject, Injectable, Optional } from "@nestjs/common";
import { PassportStrategy, Type } from "@nestjs/passport";
import { Strategy } from "passport-custom";

import { CurrentUserInterface } from "../current-user/current-user";
import { CURRENT_USER_LOADER, CurrentUserLoaderInterface } from "../current-user/current-user-loader";

interface StaticAuthedUserStrategyConfig {
    staticAuthedUser?: CurrentUserInterface;
    staticAuthedUserId?: string;
    userExtraData?: unknown;
}

export function createStaticAuthedUserStrategy(config: StaticAuthedUserStrategyConfig): Type {
    @Injectable()
    class StaticAuthedUserStrategy extends PassportStrategy(Strategy, "static-authed-user") {
        constructor(@Optional() @Inject(CURRENT_USER_LOADER) private readonly currentUserLoader: CurrentUserLoaderInterface) {
            super();
        }

        async validate(): Promise<CurrentUserInterface> {
            if (config.staticAuthedUserId) {
                if (!this.currentUserLoader) throw new Error("Inject CURRENT_USER_LOADER when setting staticAuthedUserId");
                return this.currentUserLoader.load(config.staticAuthedUserId, config.userExtraData);
            }
            if (config.staticAuthedUser) {
                return config.staticAuthedUser;
            }
            throw new Error("Either set staticAuthedUser or staticAuthedUserId");
        }
    }
    return StaticAuthedUserStrategy;
}
