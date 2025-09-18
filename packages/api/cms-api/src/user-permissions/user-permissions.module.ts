import { DiscoveryModule } from "@golevelup/nestjs-discovery";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { registerEnumType } from "@nestjs/graphql";

import { UserPermissionsGuard } from "./auth/user-permissions.guard.js";
import { ContentScopeService } from "./content-scope.service.js";
import { UserContentScopes } from "./entities/user-content-scopes.entity.js";
import { UserPermission } from "./entities/user-permission.entity.js";
import { UserResolver } from "./user.resolver.js";
import { UserContentScopesResolver } from "./user-content-scopes.resolver.js";
import { UserPermissionResolver } from "./user-permission.resolver.js";
import { ACCESS_CONTROL_SERVICE, USER_PERMISSIONS_OPTIONS, USER_PERMISSIONS_USER_SERVICE } from "./user-permissions.constants.js";
import { UserPermissionsPublicService } from "./user-permissions.public.service.js";
import { UserPermissionsService } from "./user-permissions.service.js";
import {
    CombinedPermission,
    UserPermissionsAsyncOptions,
    UserPermissionsModuleAsyncOptions,
    UserPermissionsModuleSyncOptions,
    UserPermissionsOptionsFactory,
} from "./user-permissions.types.js";

@Global()
@Module({
    imports: [MikroOrmModule.forFeature([UserPermission, UserContentScopes]), DiscoveryModule],
    providers: [
        UserPermissionsService,
        UserPermissionsPublicService,
        UserResolver,
        UserPermissionResolver,
        UserContentScopesResolver,
        ContentScopeService,
        {
            provide: APP_GUARD,
            useClass: UserPermissionsGuard,
        },
    ],
    exports: [ContentScopeService, ACCESS_CONTROL_SERVICE, UserPermissionsService, UserPermissionsPublicService],
})
export class UserPermissionsModule {
    static forRoot({ AppPermission, ...options }: UserPermissionsModuleSyncOptions): DynamicModule {
        this.registerCombinedPermission(AppPermission);

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

    static forRootAsync({ AppPermission, ...options }: UserPermissionsModuleAsyncOptions): DynamicModule {
        this.registerCombinedPermission(AppPermission);

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

    private static combinedPermissionEnumRegistered = false;

    private static registerCombinedPermission(AppPermission?: Record<string, string>): void {
        if (this.combinedPermissionEnumRegistered) {
            throw new Error(
                "CombinedPermission enum has already been registered. Make sure to register UserPermissionsModule only once in your application.",
            );
        }

        if (AppPermission) {
            Object.entries(AppPermission).forEach(([key, value]) => {
                CombinedPermission[key] = value;
            });
        }
        registerEnumType(CombinedPermission, { name: "Permission" });
        this.combinedPermissionEnumRegistered = true;
    }
}
