import { DynamicModule, Global, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ContentScope } from "src/common/decorators/content-scope.interface";

import { CurrentUser } from "../auth/dto/current-user";
import { CAN_ACCESS_SCOPE } from "./conent-scope.constants";
import { ContentScopeService } from "./content-scope.service";
import { ScopeGuard } from "./scope.guard";

export type CanAccessScope = (requestScope: ContentScope, user: CurrentUser) => boolean;

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
