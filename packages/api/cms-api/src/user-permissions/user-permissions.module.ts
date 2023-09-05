import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module, ModuleMetadata, Provider, Type } from "@nestjs/common";
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
import { ACCESS_CONTROL_SERVICE, UserPermissionConfigInterface, USERPERMISSIONS_CONFIG_SERVICE } from "./user-permissions.types";

interface UserModuleAsyncConfig extends Pick<ModuleMetadata, "imports"> {
    config: Type<UserPermissionConfigInterface>;
    accessControlService?: Type<AccessControlService>;
}

@Global()
@Module({})
export class UserPermissionsModule {
    static forRoot(config: UserModuleAsyncConfig): DynamicModule {
        const configServiceProvider: Provider = {
            provide: USERPERMISSIONS_CONFIG_SERVICE,
            useClass: config.config,
        };
        const accessControlServiceProvider: Provider = {
            provide: ACCESS_CONTROL_SERVICE,
            useClass: config.accessControlService ?? AccessControlService,
        };
        return {
            module: UserPermissionsModule,
            imports: [MikroOrmModule.forFeature([UserPermission, UserContentScopes]), ...(config.imports ?? [])],
            providers: [
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
