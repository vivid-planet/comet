import { EntityManager, type ObjectQuery } from "@mikro-orm/postgresql";
import { UnauthorizedException } from "@nestjs/common";
import { Args, ID, Query, Resolver } from "@nestjs/graphql";
import isEqual from "lodash.isequal";

import { GetCurrentUser } from "../auth/decorators/get-current-user.decorator";
import { applyDefaultFilter, filtersToMikroOrmQuery, splitSearchString } from "../common/filter/mikro-orm";
import { AffectedEntity } from "../user-permissions/decorators/affected-entity.decorator";
import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { CurrentUser } from "../user-permissions/dto/current-user";
import { ContentScope } from "../user-permissions/interfaces/content-scope.interface";
import { PaginatedWarnings } from "./dto/paginated-warnings";
import { WarningsArgs } from "./dto/warnings.args";
import { Warning } from "./entities/warning.entity";

@Resolver(() => Warning)
@RequiredPermission(["warnings"], { skipScopeCheck: true })
export class WarningResolver {
    constructor(private readonly entityManager: EntityManager) {}

    @Query(() => Warning)
    @AffectedEntity(Warning)
    async warning(@Args("id", { type: () => ID }) id: string): Promise<Warning> {
        return this.entityManager.findOneOrFail(Warning, id, { populate: ["entityInfo"] });
    }

    @Query(() => PaginatedWarnings)
    async warnings(
        @Args() { status, search, filter, scopes, sort, offset, limit }: WarningsArgs,
        @GetCurrentUser() user: CurrentUser,
    ): Promise<PaginatedWarnings> {
        // check if there are any scopes that the user does not have permission to
        const allowedScopesForUser = user.permissions.find(({ permission }) => permission === "warnings")?.contentScopes;

        for (const scope of scopes) {
            if (!allowedScopesForUser?.find((allowedScope) => isEqual(allowedScope, scope))) {
                throw new UnauthorizedException("Scopes were passed that the user does not have permission to");
            }
        }

        const scope = filter?.and?.find((item) => item.scope !== undefined)?.scope;

        if (filter?.and) {
            filter.and = filter.and.filter((item) => item.scope === undefined);
        }

        const metadata = this.entityManager.getMetadata(Warning);
        const where: ObjectQuery<Warning> = {};

        if (filter) {
            // `type` isn't a Warning column: it lives in the `sourceInfo` JSONB and is mirrored by the generated
            // `rootEntityName` column. `entityInfo` is a relation to the EntityInfo view (name / secondary information),
            // so its nested filter is converted on its own. Everything else maps 1:1 to a Warning column.
            where.$and = [
                filtersToMikroOrmQuery(filter, {
                    metadata,
                    applyFilter: (acc, filterProperty, filterKey) => {
                        if (filterKey === "entityInfo") {
                            acc.entityInfo = filtersToMikroOrmQuery(filterProperty);
                        } else if (filterKey === "type") {
                            applyDefaultFilter(acc, filterProperty, "rootEntityName");
                        } else {
                            applyDefaultFilter(acc, filterProperty, filterKey, metadata);
                        }
                    },
                }),
            ];
        }

        where.status = { $in: status };

        if (search) {
            where.$and = where.$and ?? [];
            for (const searchPart of splitSearchString(search)) {
                where.$and.push({
                    $or: [
                        { message: { $ilike: searchPart } },
                        { rootEntityName: { $ilike: searchPart } },
                        { entityInfo: { name: { $ilike: searchPart } } },
                        { entityInfo: { secondaryInformation: { $ilike: searchPart } } },
                    ],
                });
            }
        }

        // A scope can be for example { domain: "main", language: "en" } but it should also query scopes that are only { domain: "main" }.
        // These additional scopes are calculated here.
        const additionalScopes: ContentScope[] = [];

        const keyValueMap: Record<string, Set<string | number>> = {};
        for (const scope of scopes) {
            for (const key of Object.keys(scope)) {
                if (!keyValueMap[key]) {
                    keyValueMap[key] = new Set();
                }
                keyValueMap[key].add(scope[key as keyof ContentScope]);
            }
        }
        for (const key of Object.keys(keyValueMap)) {
            for (const value of keyValueMap[key]) {
                additionalScopes.push({ [key]: value });
            }
        }
        const allowedScopes = scopes.concat(additionalScopes);

        where.$or = [{ scope: { $in: allowedScopes } }, { scope: { $eq: null } }];
        if (scope) {
            where.$and = where.$and || [];
            if (scope?.equal) {
                const scopeEqual = scope.equal;
                where.$and.push({ scope: { $eq: scopeEqual } });
            } else if (scope.notEqual) {
                where.$and.push({ scope: { $ne: scope.notEqual } });
            } else if (scope.isAnyOf) {
                where.$and.push({ scope: { $in: scope.isAnyOf } });
            }
        }

        // `name` sorts by the joined EntityInfo view, `type` by the generated `rootEntityName` column; the join is
        // added automatically by MikroORM when the order-by references the relation.
        const orderBy = sort?.map((sortItem) => {
            if (sortItem.field === "name") {
                return { entityInfo: { name: sortItem.direction } };
            }
            if (sortItem.field === "type") {
                return { rootEntityName: sortItem.direction };
            }
            return { [sortItem.field]: sortItem.direction };
        });

        const [entities, totalCount] = await this.entityManager.findAndCount(Warning, where, {
            offset,
            limit,
            orderBy: orderBy?.length ? orderBy : undefined,
            populate: ["entityInfo"],
        });

        return new PaginatedWarnings(entities, totalCount);
    }
}
