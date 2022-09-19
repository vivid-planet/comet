import { DynamicModule, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { CurrentUser } from "../auth/dto/current-user";
import { CONTENT_SCOPES_FROM_USER } from "./conent-scope.constants";
import { ScopeGuard } from "./scope.guard";

interface ContentScopeModuleOptions {
    contentScopesFromUser: (user: CurrentUser) => Array<Record<string, string>> | undefined;
}

@Module({})
export class ContentScopeModule {
    static forRoot(options: ContentScopeModuleOptions): DynamicModule {
        const { contentScopesFromUser } = options;
        return {
            module: ContentScopeModule,
            imports: [],
            providers: [
                { provide: APP_GUARD, useClass: ScopeGuard },
                { provide: CONTENT_SCOPES_FROM_USER, useValue: contentScopesFromUser },
            ],
            exports: [],
        };
    }
}
