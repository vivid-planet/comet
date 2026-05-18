import { EntityManager, FilterQuery } from "@mikro-orm/postgresql";
import { Args, Int, Query, Resolver } from "@nestjs/graphql";

import { GetCurrentUser } from "../auth/decorators/get-current-user.decorator";
import { EntityInfoObject } from "../entity-info/entity-info.object";
import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { CurrentUser } from "../user-permissions/dto/current-user";
import { PaginatedEntityInfo } from "./dto/paginated-entity-info";
import { EntityInfoFullTextObject } from "./entities/entity-info-full-text.object";

@Resolver(() => EntityInfoObject)
@RequiredPermission("fullTextSearch", { skipScopeCheck: true })
export class FullTextSearchResolver {
    constructor(private readonly entityManager: EntityManager) {}

    @Query(() => PaginatedEntityInfo)
    async fullTextSearch(
        @Args("search") search: string,
        @Args("offset", { type: () => Int, defaultValue: 0 }) offset: number,
        @Args("limit", { type: () => Int, defaultValue: 25 }) limit: number,
        @GetCurrentUser() user: CurrentUser,
    ): Promise<PaginatedEntityInfo> {
        const where: FilterQuery<EntityInfoFullTextObject> = {
            fullText: { $fulltext: search },
        };

        // Only show entities where the user has the required permission.
        // Entries with null requiredPermission are never shown, as the permission is unknown.
        if (typeof user !== "string" && user.permissions) {
            const userPermissions = user.permissions.map((p) => p.permission);
            if (userPermissions.length > 0) {
                where.requiredPermission = { $overlap: userPermissions };
            } else {
                return new PaginatedEntityInfo([], 0);
            }
        } else {
            // System users: show all entries that have a requiredPermission set
            where.requiredPermission = { $ne: null };
        }

        const [matches, totalCount] = await this.entityManager.findAndCount(
            EntityInfoFullTextObject,
            where,
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
