import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { CURRENT_USER_LOADER } from "../auth/current-user/current-user-loader";
import { AccessControlService } from "./access-control.service";
import { UserPermissionsCurrentUserLoader } from "./auth/current-user-loader";
import { UserPermissionsGuard } from "./auth/user-permissions.guard";
import { ContentScopeService } from "./content-scope.service";
import { UserContentScopes } from "./entities/user-content-scopes.entity";
import { UserPermission } from "./entities/user-permission.entity";
import { UserResolver } from "./user.resolver";
import { UserContentScopesResolver } from "./user-content-scopes.resolver";
import { UserPermissionResolver } from "./user-permission.resolver";
import { ACCESS_CONTROL_SERVICE, USER_PERMISSIONS_OPTIONS } from "./user-permissions.constants";
import { UserPermissionsService } from "./user-permissions.service";
import { UserPermissionsAsyncOptions, UserPermissionsOptions, UserPermissionsOptionsFactory } from "./user-permissions.types";

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
        UserPermissionsCurrentUserLoader,
        {
            provide: APP_GUARD,
            useClass: UserPermissionsGuard,
        },
    ],
    exports: [CURRENT_USER_LOADER, ContentScopeService, UserPermissionsCurrentUserLoader],
})
export class UserPermissionsModule {
    static forRoot(options: UserPermissionsOptions): DynamicModule {
        return {
            module: UserPermissionsModule,
            providers: [
                {
                    provide: USER_PERMISSIONS_OPTIONS,
                    useValue: options,
                },
                {
                    provide: ACCESS_CONTROL_SERVICE,
                    useValue: options.accessControlService ?? new AccessControlService(),
                },
            ],
        };
    }

    static forRootAsync(asyncOptions: UserPermissionsAsyncOptions): DynamicModule {
        return {
            module: UserPermissionsModule,
            imports: asyncOptions.imports,
            providers: [
                this.createProvider(asyncOptions),
                {
                    provide: ACCESS_CONTROL_SERVICE,
                    useFactory: (options: UserPermissionsOptions) => options.accessControlService ?? new AccessControlService(),
                    inject: [USER_PERMISSIONS_OPTIONS],
                },
            ],
        };
    }

    private static createProvider(options: UserPermissionsAsyncOptions): Provider {
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
