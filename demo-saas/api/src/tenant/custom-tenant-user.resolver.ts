import { RequiredPermission } from "@comet/cms-api";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { UserService } from "@src/auth/user.service";

import { TenantUser } from "./entities/tenant-user.entity";

@Resolver(() => TenantUser)
@RequiredPermission(["tenantAdministration"], { skipScopeCheck: true })
export class CustomTenantUserResolver {
    constructor(private readonly userService: UserService) {}

    @ResolveField(() => String)
    async userName(@Parent() tenantUser: TenantUser): Promise<string> {
        return (await this.userService.getUser(tenantUser.userId)).name;
    }
}
