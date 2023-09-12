import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module, ModuleMetadata, Type } from "@nestjs/common";

import { UserContentScopes } from "./entities/user-content-scopes.entity";
import { UserPermission } from "./entities/user-permission.entity";
import { UserResolver } from "./user.resolver";
import { UserContentScopesResolver } from "./user-content-scopes.resolver";
import { UserPermissionResolver } from "./user-permission.resolver";
import { USER_PERMISSIONS_CONFIG_SERVICE } from "./user-permissions.const";
import { UserPermissionsService } from "./user-permissions.service";
import { UserPermissionConfigInterface } from "./user-permissions.types";

interface UserModuleConfig extends Pick<ModuleMetadata, "imports"> {
    config: Type<UserPermissionConfigInterface>;
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
                UserPermissionsService,
                UserResolver,
                UserPermissionResolver,
                UserContentScopesResolver,
            ],
            exports: [UserPermissionsService],
        };
    }
}
