import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module, Provider } from "@nestjs/common";

import { UserContentScopes } from "./entities/user-content-scopes.entity";
import { UserPermission } from "./entities/user-permission.entity";
import { UserResolver } from "./user.resolver";
import { UserContentScopesResolver } from "./user-content-scopes.resolver";
import { UserPermissionResolver } from "./user-permission.resolver";
import { USER_PERMISSIONS_OPTIONS, USER_PERMISSIONS_SERVICE } from "./user-permissions.constants";
import { UserPermissionsService } from "./user-permissions.service";
import { UserPermissionsAsyncOptions, UserPermissionsOptions, UserPermissionsOptionsFactory } from "./user-permissions.types";

@Global()
@Module({
    imports: [MikroOrmModule.forFeature([UserPermission, UserContentScopes])],
    providers: [UserPermissionsService, UserResolver, UserPermissionResolver, UserContentScopesResolver, UserPermissionsService],
    exports: [UserPermissionsService],
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
                    provide: USER_PERMISSIONS_SERVICE,
                    useClass: UserPermissionsService,
                },
            ],
            exports: [USER_PERMISSIONS_SERVICE],
        };
    }

    static forRootAsync(asyncOptions: UserPermissionsAsyncOptions): DynamicModule {
        return {
            module: UserPermissionsModule,
            imports: asyncOptions.imports,
            providers: [
                this.createProvider(asyncOptions),
                {
                    provide: USER_PERMISSIONS_SERVICE,
                    useClass: UserPermissionsService,
                },
            ],
            exports: [USER_PERMISSIONS_SERVICE],
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
