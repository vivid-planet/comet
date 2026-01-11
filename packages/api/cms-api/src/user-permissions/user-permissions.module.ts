import { DiscoveryModule } from "@golevelup/nestjs-discovery";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { registerEnumType } from "@nestjs/graphql";

import { UserPermissionsGuard } from "./auth/user-permissions.guard";
import { ContentScopeService } from "./content-scope.service";
import { UserContentScopes } from "./entities/user-content-scopes.entity";
import { UserPermission } from "./entities/user-permission.entity";
import { UserResolver } from "./user.resolver";
import { UserContentScopesResolver } from "./user-content-scopes.resolver";
import { UserPermissionResolver } from "./user-permission.resolver";
import { ACCESS_CONTROL_SERVICE, USER_PERMISSIONS_OPTIONS, USER_PERMISSIONS_USER_SERVICE } from "./user-permissions.constants";
import { UserPermissionsPublicService } from "./user-permissions.public.service";
import { UserPermissionsService } from "./user-permissions.service";
import {
    CombinedPermission,
    UserPermissionsAsyncOptions,
    UserPermissionsModuleAsyncOptions,
    UserPermissionsModuleSyncOptions,
    UserPermissionsOptionsFactory,
} from "./user-permissions.types";

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

    private static registerCombinedPermission(PassedAppPermission?: Record<string, string> | Array<Record<string, string>>): void {
        if (this.combinedPermissionEnumRegistered) {
            throw new Error(
                "CombinedPermission enum has already been registered. Make sure to register UserPermissionsModule only once in your application.",
            );
        }

        let AppPermissions: Record<string, string>[] | undefined;
        if (PassedAppPermission && Array.isArray(PassedAppPermission)) {
            AppPermissions = PassedAppPermission;
        } else if (PassedAppPermission) {
            AppPermissions = [PassedAppPermission];
        }

        if (AppPermissions) {
            for (const AppPermission of AppPermissions) {
                Object.entries(AppPermission).forEach(([key, value]) => {
                    CombinedPermission[key] = value;
                });
            }
        }

        registerEnumType(CombinedPermission, { name: "Permission" });
        this.combinedPermissionEnumRegistered = true;
    }
}
