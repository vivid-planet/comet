import { Inject, Injectable, Optional } from "@nestjs/common";
import { PassportStrategy, Type } from "@nestjs/passport";
import { Strategy } from "passport-custom";

import { CurrentUserInterface } from "../current-user/current-user";
import { CURRENT_USER_LOADER, CurrentUserLoaderInterface } from "../current-user/current-user-loader";

interface StaticAuthedUserStrategyConfig {
    staticAuthedUser: CurrentUserInterface | string;
    userExtraData?: unknown;
}

export function createStaticAuthedUserStrategy(config: StaticAuthedUserStrategyConfig): Type {
    @Injectable()
    class StaticAuthedUserStrategy extends PassportStrategy(Strategy, "static-authed-user") {
        constructor(@Optional() @Inject(CURRENT_USER_LOADER) private readonly currentUserLoader: CurrentUserLoaderInterface) {
            super();
        }

        async validate(): Promise<CurrentUserInterface> {
            if (typeof config.staticAuthedUser === "string") {
                if (!this.currentUserLoader) throw new Error("You have to provide CURRENT_USER_LOADER when setting staticAuthedUser as string");
                return this.currentUserLoader.load(config.staticAuthedUser, config.userExtraData);
            }
            return config.staticAuthedUser;
        }
    }
    return StaticAuthedUserStrategy;
}
