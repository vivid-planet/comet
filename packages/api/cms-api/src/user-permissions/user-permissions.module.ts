import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module, ModuleMetadata, Provider } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { ContentScope } from "../common/decorators/content-scope.interface";
import { CAN_ACCESS_SCOPE } from "../content-scope/conent-scope.constants";
import { ContentScopeService } from "../content-scope/content-scope.service";
import { UserPermissionsGuard } from "./auth/user-permissions.guard";
import { CurrentUser } from "./current-user";
import { FindUsersArgs } from "./dto/paginated-user-list";
import { User } from "./dto/user";
import { UserContentScopes } from "./entities/user-content-scopes.entity";
import { UserPermission } from "./entities/user-permission.entity";
import { UserResolver } from "./user.resolver";
import { UserContentScopesResolver } from "./user-content-scopes.resolver";
import { UserPermissionResolver } from "./user-permission.resolver";
import { UserPermissionsService } from "./user-permissions.service";
import {
    AvailableContentScopes,
    AvailablePermissions,
    ContentScopes,
    Permissions,
    USER_MODULE_CONFIG,
    USERPERMISSIONS,
} from "./user-permissions.types";

export interface UserModuleConfig<PermissionKeys extends string = string> {
    userService: {
        getUser: (id: string) => Promise<User>;
        findUsers: (args: FindUsersArgs) => Promise<[User[], number]>;
    };
    getAvailablePermissions?: () => Promise<AvailablePermissions<PermissionKeys>>;
    getAvailableContentScopes?: () => Promise<AvailableContentScopes>;
    getPermissions?: (user: User) => Promise<Permissions<PermissionKeys | "userPermissions" | "pageTree" | "dam"> | "all-permissions">;
    getContentScopes?: (user: User) => Promise<ContentScopes>;
}

interface UserModuleAsyncConfig<AvailablePermissions extends string> extends Pick<ModuleMetadata, "imports"> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFactory: (...args: any[]) => Promise<UserModuleConfig<AvailablePermissions>>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inject?: any[];
}

@Global()
@Module({})
export class UserPermissionsModule {
    static forRoot<AvailablePermissions extends string>(config: UserModuleConfig<AvailablePermissions>): DynamicModule {
        return UserPermissionsModule._register({
            provide: USER_MODULE_CONFIG,
            useValue: config,
        });
    }

    static forRootAsync<AvailablePermissions extends string>(asyncConfig: UserModuleAsyncConfig<AvailablePermissions>): DynamicModule {
        return UserPermissionsModule._register({
            provide: USER_MODULE_CONFIG,
            ...asyncConfig,
        });
    }

    private static _register(configProvider: Provider): DynamicModule {
        return {
            module: UserPermissionsModule,
            imports: [MikroOrmModule.forFeature([UserPermission, UserContentScopes])],
            providers: [
                {
                    provide: CAN_ACCESS_SCOPE,
                    useValue: (requestScope: ContentScope, user: CurrentUser) => user.isAllowed(USERPERMISSIONS.pageTree, requestScope),
                },
                configProvider,
                ContentScopeService,
                UserPermissionsService,
                UserResolver,
                UserPermissionResolver,
                UserContentScopesResolver,
                {
                    provide: APP_GUARD,
                    useClass: UserPermissionsGuard,
                },
            ],
            exports: [UserPermissionsService, ContentScopeService],
        };
    }
}
