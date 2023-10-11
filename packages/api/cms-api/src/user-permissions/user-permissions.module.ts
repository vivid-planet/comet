import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module, Provider } from "@nestjs/common";

import { UserContentScopes } from "./entities/user-content-scopes.entity";
import { UserPermission } from "./entities/user-permission.entity";
import { UserResolver } from "./user.resolver";
import { UserContentScopesResolver } from "./user-content-scopes.resolver";
import { UserPermissionResolver } from "./user-permission.resolver";
import { USER_PERMISSIONS_OPTIONS, USER_PERMISSIONS_USER_SERVICE } from "./user-permissions.constants";
import { UserPermissionsService } from "./user-permissions.service";
import { AsyncOptions, OptionsFactory, UserPermissionsOptions, UserPermissionsUserService } from "./user-permissions.types";

@Global()
@Module({
    imports: [MikroOrmModule.forFeature([UserPermission, UserContentScopes])],
    providers: [UserPermissionsService, UserResolver, UserPermissionResolver, UserContentScopesResolver, UserPermissionsService],
    exports: [UserPermissionsService],
})
export class UserPermissionsModule {
    static forRoot(options: UserPermissionsOptions, userService: UserPermissionsUserService): DynamicModule {
        return {
            module: UserPermissionsModule,
            providers: [
                {
                    provide: USER_PERMISSIONS_OPTIONS,
                    useValue: options,
                },
                {
                    provide: USER_PERMISSIONS_USER_SERVICE,
                    useValue: userService,
                },
            ],
        };
    }

    static forRootAsync(options: AsyncOptions<UserPermissionsOptions>, userService: AsyncOptions<UserPermissionsUserService>): DynamicModule {
        return {
            module: UserPermissionsModule,
            imports: [...(options.imports ?? []), ...(userService.imports ?? [])],
            providers: [
                this.createProvider<UserPermissionsOptions>(options, USER_PERMISSIONS_OPTIONS),
                this.createProvider<UserPermissionsUserService>(userService, USER_PERMISSIONS_USER_SERVICE),
            ],
        };
    }

    private static createProvider<T>(options: AsyncOptions<T>, provide: string): Provider {
        if (options.useFactory) {
            return {
                provide,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }

        // For useClass and useExisting...
        return {
            provide,
            useFactory: async (optionsFactory: OptionsFactory<T>) => optionsFactory.createOptions(),
            inject: options.useExisting ? [options.useExisting] : options.useClass ? [options.useClass] : [],
        };
    }
}
