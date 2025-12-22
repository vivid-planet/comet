import { RequiredPermission } from "@comet/cms-api";
import { EntityManager, Reference } from "@mikro-orm/core";
import { Args, ID, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { UserService } from "@src/auth/user.service";
import { v4 } from "uuid";

import { Tenant } from "./entities/tenant.entity";
import { TenantUser } from "./entities/tenant-user.entity";

@Resolver(() => TenantUser)
@RequiredPermission(["tenantAdministration"], { skipScopeCheck: true })
export class CustomTenantUserResolver {
    constructor(
        private readonly userService: UserService,
        private readonly entityManager: EntityManager,
    ) {}

    @Mutation(() => [TenantUser])
    async assignTenantUsers(
        @Args("tenant", { type: () => ID }) tenant: string,
        @Args("userIds", { type: () => [String] }) userIds: string[],
    ): Promise<TenantUser[]> {
        const tenantReference = Reference.create(await this.entityManager.findOneOrFail(Tenant, tenant));
        const tenantUsers = await this.entityManager.upsertMany(
            TenantUser,
            userIds.map((userId) => ({
                id: v4(),
                tenant: tenantReference,
                userId,
            })),
            { onConflictFields: ["tenant", "userId"], onConflictExcludeFields: ["id"] },
        );
        await this.entityManager.flush();
        return tenantUsers;
    }

    @ResolveField(() => String)
    async userName(@Parent() tenantUser: TenantUser): Promise<string> {
        return this.userService.getUser(tenantUser.userId).name;
    }
}
