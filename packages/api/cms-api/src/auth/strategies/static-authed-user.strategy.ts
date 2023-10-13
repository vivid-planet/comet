import { Inject, Injectable, Optional } from "@nestjs/common";
import { PassportStrategy, Type } from "@nestjs/passport";
import { Strategy } from "passport-custom";

import { CurrentUserInterface } from "../current-user/current-user";
import { CURRENT_USER_LOADER, CurrentUserLoader, CurrentUserLoaderInterface } from "../current-user/current-user-loader";

interface StaticAuthedUserStrategyConfig {
    staticAuthedUser: CurrentUserInterface;
}

export function createStaticAuthedUserStrategy(config: StaticAuthedUserStrategyConfig): Type {
    @Injectable()
    class StaticAuthedUserStrategy extends PassportStrategy(Strategy, "static-authed-user") {
        constructor(@Optional() @Inject(CURRENT_USER_LOADER) private readonly currentUserLoader: CurrentUserLoaderInterface) {
            super();
            if (!this.currentUserLoader) this.currentUserLoader = new CurrentUserLoader();
        }

        validate(): Promise<CurrentUserInterface> {
            return this.currentUserLoader.load(config.staticAuthedUser);
        }
    }
    return StaticAuthedUserStrategy;
}
