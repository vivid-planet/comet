import { DynamicModule, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ContentScope } from "src/common/decorators/content-scope.interface";

import { CAN_ACCESS_SCOPE } from "./conent-scope.constants";
import { ScopeGuard } from "./scope.guard";

interface ContentScopeModuleOptions<CurrentUser> {
    canAccessScope: (requestScope: ContentScope, user: CurrentUser) => boolean;
}

@Module({})
export class ContentScopeModule {
    static forRoot<CurrentUser>(options: ContentScopeModuleOptions<CurrentUser>): DynamicModule {
        const { canAccessScope } = options;
        return {
            module: ContentScopeModule,
            imports: [],
            providers: [
                { provide: APP_GUARD, useClass: ScopeGuard },
                { provide: CAN_ACCESS_SCOPE, useValue: canAccessScope },
            ],
            exports: [],
        };
    }
}
