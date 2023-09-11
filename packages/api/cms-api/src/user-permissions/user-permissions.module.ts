import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module, ModuleMetadata, Type } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { AccessControlService } from "./access-control.service";
import { UserPermissionsGuard } from "./auth/user-permissions.guard";
import { UserContentScopes } from "./entities/user-content-scopes.entity";
import { UserPermission } from "./entities/user-permission.entity";
import { InferScopeService } from "./infer-scope.service";
import { UserResolver } from "./user.resolver";
import { UserContentScopesResolver } from "./user-content-scopes.resolver";
import { UserPermissionResolver } from "./user-permission.resolver";
import { ACCESS_CONTROL_SERVICE, USER_PERMISSIONS_CONFIG_SERVICE } from "./user-permissions.const";
import { UserPermissionsService } from "./user-permissions.service";
import { UserPermissionConfigInterface } from "./user-permissions.types";

interface UserModuleConfig extends Pick<ModuleMetadata, "imports"> {
    config: Type<UserPermissionConfigInterface>;
    accessControlService?: Type<AccessControlService>;
}

@Global()
@Module({})
export class UserPermissionsModule {
    static forRoot(config: UserModuleConfig): DynamicModule {
        return {
            module: UserPermissionsModule,
            imports: [MikroOrmModule.forFeature([UserPermission, UserContentScopes]), ...(config.imports ?? [])],
            providers: [
                {
                    provide: USER_PERMISSIONS_CONFIG_SERVICE,
                    useClass: config.config,
                },
                {
                    provide: ACCESS_CONTROL_SERVICE,
                    useClass: config.accessControlService ?? AccessControlService,
                },
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
            exports: [UserPermissionsService, ACCESS_CONTROL_SERVICE, InferScopeService],
        };
    }
}
