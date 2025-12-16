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

    @Mutation(() => TenantUser)
    async assignTenantUser(
        @Args("tenant", { type: () => ID }) tenant: string,
        @Args("userId", { type: () => String }) userId: string,
    ): Promise<TenantUser> {
        const tenantUser = this.entityManager.upsert(
            TenantUser,
            {
                id: v4(),
                tenant: Reference.create(await this.entityManager.findOneOrFail(Tenant, tenant)),
                userId,
            },
            { onConflictFields: ["tenant", "userId"], onConflictExcludeFields: ["id"] },
        );
        await this.entityManager.flush();
        return tenantUser;
    }

    @ResolveField(() => String)
    async userName(@Parent() tenantUser: TenantUser): Promise<string> {
        return this.userService.getUser(tenantUser.userId).name;
    }
}
