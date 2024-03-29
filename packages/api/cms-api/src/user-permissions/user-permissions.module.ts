import { DiscoveryModule } from "@golevelup/nestjs-discovery";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { UserPermissionsGuard } from "./auth/user-permissions.guard";
import { ContentScopeService } from "./content-scope.service";
import { LogUser } from "./entities/log-user.entity";
import { LogUserPermission } from "./entities/log-user-permission.entity";
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
import { UserPermissionsLogResolver } from "./user-permissions-log.resolver";

@Global()
@Module({
    imports: [MikroOrmModule.forFeature([UserPermission, UserContentScopes, LogUserPermission, LogUser]), DiscoveryModule],
    providers: [
        UserPermissionsService,
        UserResolver,
        UserPermissionResolver,
        UserContentScopesResolver,
        UserPermissionsLogResolver,
        ContentScopeService,
        {
            provide: APP_GUARD,
            useClass: UserPermissionsGuard,
        },
    ],
    exports: [ContentScopeService, ACCESS_CONTROL_SERVICE, UserPermissionsService],
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
                    provide: ACCESS_CONTROL_SERVICE,
                    useClass: options.AccessControlService,
                },
                ...(options.UserService
                    ? [
                          {
                              provide: USER_PERMISSIONS_USER_SERVICE,
                              useClass: options.UserService,
                          },
                      ]
                    : []),
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
