import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module, ModuleMetadata } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { AccessControlService } from "./access-control.service";
import { UserPermissionsGuard } from "./auth/user-permissions.guard";
import { UserContentScopes } from "./entities/user-content-scopes.entity";
import { UserPermission } from "./entities/user-permission.entity";
import { InferScopeService } from "./infer-scope.service";
import { UserResolver } from "./user.resolver";
import { UserContentScopesResolver } from "./user-content-scopes.resolver";
import { UserPermissionResolver } from "./user-permission.resolver";
import { UserPermissionsService } from "./user-permissions.service";
import {
    ACCESS_CONTROL_SERVICE,
    UserPermissionConfigInterface,
    USERPERMISSIONS_CONFIG,
    USERPERMISSIONS_CONFIG_SERVICE,
} from "./user-permissions.types";

type UserModuleConfig = {
    config: UserPermissionConfigInterface;
    accessControlService?: AccessControlService;
};
interface UserModuleAsyncConfig extends Pick<ModuleMetadata, "imports"> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFactory: (...args: any[]) => Promise<UserModuleConfig>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inject?: any[];
}

@Global()
@Module({})
export class UserPermissionsModule {
    static forRootAsync(config: UserModuleAsyncConfig): DynamicModule {
        const configServiceProvider = {
            provide: USERPERMISSIONS_CONFIG_SERVICE,
            useFactory: (config: UserModuleConfig): UserPermissionConfigInterface => {
                return config.config;
            },
            inject: [USERPERMISSIONS_CONFIG],
        };
        const accessControlServiceProvider = {
            provide: ACCESS_CONTROL_SERVICE,
            useFactory: (config: UserModuleConfig) => {
                return config.accessControlService ?? new AccessControlService();
            },
            inject: [USERPERMISSIONS_CONFIG],
        };
        return {
            module: UserPermissionsModule,
            imports: [MikroOrmModule.forFeature([UserPermission, UserContentScopes]), ...(config.imports ?? [])],
            providers: [
                {
                    provide: USERPERMISSIONS_CONFIG,
                    ...config,
                },
                accessControlServiceProvider,
                configServiceProvider,
                InferScopeService,
                UserPermissionsService,
                UserResolver,
                UserPermissionResolver,
                UserContentScopesResolver,
                {
                    provide: APP_GUARD,
                    useClass: UserPermissionsGuard,
                },
            ],
            exports: [UserPermissionsService, accessControlServiceProvider, InferScopeService],
        };
    }
}
