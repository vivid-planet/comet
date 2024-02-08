import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { CURRENT_USER_LOADER } from "../auth/current-user/current-user-loader";
import { UserPermissionsCurrentUserLoader } from "./auth/current-user-loader";
import { UserPermissionsGuard } from "./auth/user-permissions.guard";
import { ContentScopeService } from "./content-scope.service";
import { UserContentScopes } from "./entities/user-content-scopes.entity";
import { UserPermission } from "./entities/user-permission.entity";
import { UserResolver } from "./user.resolver";
import { UserContentScopesResolver } from "./user-content-scopes.resolver";
import { UserPermissionResolver } from "./user-permission.resolver";
import { ACCESS_CONTROL_SERVICE, USER_PERMISSIONS_OPTIONS, USER_PERMISSIONS_USER_SERVICE } from "./user-permissions.constants";
import { UserPermissionsService } from "./user-permissions.service";
import {
    UserPermissionsAsyncOptions,
    UserPermissionsModuleAsyncOptions,
    UserPermissionsModuleSyncOptions,
    UserPermissionsOptionsFactory,
} from "./user-permissions.types";

@Global()
@Module({
    imports: [MikroOrmModule.forFeature([UserPermission, UserContentScopes])],
    providers: [
        UserPermissionsService,
        UserResolver,
        UserPermissionResolver,
        UserContentScopesResolver,
        {
            provide: CURRENT_USER_LOADER,
            useClass: UserPermissionsCurrentUserLoader,
        },
        ContentScopeService,
        {
            provide: APP_GUARD,
            useClass: UserPermissionsGuard,
        },
    ],
    exports: [CURRENT_USER_LOADER, ContentScopeService, ACCESS_CONTROL_SERVICE],
})
export class UserPermissionsModule {
    static forRoot(options: UserPermissionsModuleSyncOptions): DynamicModule {
        return {
            module: UserPermissionsModule,
            providers: [
                {
                    provide: USER_PERMISSIONS_OPTIONS,
                    useValue: options,
                },
                {
                    provide: USER_PERMISSIONS_USER_SERVICE,
                    useClass: options.UserService,
                },
                {
                    provide: ACCESS_CONTROL_SERVICE,
                    useClass: options.AccessControlService,
                },
            ],
        };
    }

    static forRootAsync(options: UserPermissionsModuleAsyncOptions): DynamicModule {
        return {
            module: UserPermissionsModule,
            imports: options.imports,
            providers: [
                this.createProvider(options),
                {
                    provide: USER_PERMISSIONS_USER_SERVICE,
                    useFactory: (options: UserPermissionsAsyncOptions) => options.userService,
                    inject: [USER_PERMISSIONS_OPTIONS],
                },
                {
                    provide: ACCESS_CONTROL_SERVICE,
                    useFactory: (options: UserPermissionsAsyncOptions) => options.accessControlService,
                    inject: [USER_PERMISSIONS_OPTIONS],
                },
            ],
        };
    }

    private static createProvider(options: UserPermissionsModuleAsyncOptions): Provider {
        if (options.useFactory) {
            return {
                provide: USER_PERMISSIONS_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }

        // For useClass and useExisting...
        return {
            provide: USER_PERMISSIONS_OPTIONS,
            useFactory: async (optionsFactory: UserPermissionsOptionsFactory) => optionsFactory.createUserPermissionsOptions(),
            inject: options.useExisting ? [options.useExisting] : options.useClass ? [options.useClass] : [],
        };
    }
}
