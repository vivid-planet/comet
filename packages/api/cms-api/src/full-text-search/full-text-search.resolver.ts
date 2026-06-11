import { EntityManager } from "@mikro-orm/postgresql";
import { ForbiddenException, Inject } from "@nestjs/common";
import { Args, Int, Query, Resolver } from "@nestjs/graphql";

import { GetCurrentUser } from "../auth/decorators/get-current-user.decorator";
import { EntityInfoObject } from "../entity-info/entity-info.object";
import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { CurrentUser } from "../user-permissions/dto/current-user";
import { ACCESS_CONTROL_SERVICE } from "../user-permissions/user-permissions.constants";
import { AccessControlServiceInterface, CombinedPermission, Permission } from "../user-permissions/user-permissions.types";
import { PaginatedEntityInfo } from "./dto/paginated-entity-info";
import { EntityInfoFullTextObject } from "./entities/entity-info-full-text.object";

@Resolver(() => EntityInfoObject)
@RequiredPermission("fullTextSearch", { skipScopeCheck: true })
export class FullTextSearchResolver {
    constructor(
        private readonly entityManager: EntityManager,
        @Inject(ACCESS_CONTROL_SERVICE) private readonly accessControlService: AccessControlServiceInterface,
    ) {}

    @Query(() => PaginatedEntityInfo)
    async fullTextSearch(
        @Args("search") search: string,
        @Args("requiredPermissions", { type: () => [CombinedPermission] }) requiredPermissions: Permission[],
        @Args("offset", { type: () => Int, defaultValue: 0 }) offset: number,
        @Args("limit", { type: () => Int, defaultValue: 25 }) limit: number,
        @GetCurrentUser() user: CurrentUser,
    ): Promise<PaginatedEntityInfo> {
        const missingPermission = requiredPermissions.find((permission) => !this.accessControlService.isAllowed(user, permission));
        if (missingPermission) {
            throw new ForbiddenException(`User does not have the required permission "${missingPermission}".`);
        }

        const [matches, totalCount] = await this.entityManager.findAndCount(
            EntityInfoFullTextObject,
            {
                fullText: { $fulltext: search },
                requiredPermission: { $overlap: requiredPermissions },
            },
            { offset, limit },
        );

        if (matches.length === 0) {
            return new PaginatedEntityInfo([], totalCount);
        }

        // Join with EntityInfo view to fetch name, secondaryInformation, visible for the matched rows
        const infos = await this.entityManager.find(EntityInfoObject, {
            $or: matches.map((match) => ({ id: match.id, entityName: match.entityName })),
        });

        const infoByKey = new Map(infos.map((info) => [`${info.entityName}:${info.id}`, info]));
        const results = matches.map((match) => {
            const info = infoByKey.get(`${match.entityName}:${match.id}`);
            if (!info) {
                throw new Error(
                    `EntityInfo not found for ${match.entityName}:${match.id}. This may indicate a data inconsistency where the full-text search index contains an entry without corresponding entity information.`,
                );
            }
            return info;
        });

        return new PaginatedEntityInfo(results, totalCount);
    }
}
