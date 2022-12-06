import { DynamicModule, Global, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { CurrentUserInterface } from "src/auth/current-user/current-user";
import { ContentScope } from "src/common/decorators/content-scope.interface";

import { CAN_ACCESS_SCOPE } from "./conent-scope.constants";
import { ContentScopeService } from "./content-scope.service";
import { ScopeGuard } from "./scope.guard";

export type CanAccessScope = (requestScope: ContentScope, user: CurrentUserInterface) => boolean;

interface ContentScopeModuleOptions {
    canAccessScope: CanAccessScope;
}

@Global()
@Module({})
export class ContentScopeModule {
    static forRoot(options: ContentScopeModuleOptions): DynamicModule {
        const { canAccessScope } = options;
        return {
            module: ContentScopeModule,
            imports: [],
            providers: [{ provide: APP_GUARD, useClass: ScopeGuard }, { provide: CAN_ACCESS_SCOPE, useValue: canAccessScope }, ContentScopeService],
            exports: [ContentScopeService],
        };
    }
}
