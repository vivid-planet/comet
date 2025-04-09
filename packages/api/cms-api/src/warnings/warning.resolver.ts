import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository, FindOptions } from "@mikro-orm/postgresql";
import { UnauthorizedException } from "@nestjs/common";
import { Args, ID, Query, Resolver } from "@nestjs/graphql";
import isEqual from "lodash.isequal";

import { GetCurrentUser } from "../auth/decorators/get-current-user.decorator";
import { gqlArgsToMikroOrmQuery } from "../common/filter/mikro-orm";
import { AffectedEntity } from "../user-permissions/decorators/affected-entity.decorator";
import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { CurrentUser } from "../user-permissions/dto/current-user";
import { PaginatedWarnings } from "./dto/paginated-warnings";
import { WarningsArgs } from "./dto/warnings.args";
import { Warning } from "./entities/warning.entity";

@Resolver(() => Warning)
@RequiredPermission(["warnings"], { skipScopeCheck: true })
export class WarningResolver {
    constructor(
        private readonly entityManager: EntityManager,
        @InjectRepository(Warning) private readonly repository: EntityRepository<Warning>,
    ) {}

    @Query(() => Warning)
    @AffectedEntity(Warning)
    async warning(@Args("id", { type: () => ID }) id: string): Promise<Warning> {
        const warning = await this.repository.findOneOrFail(id);
        return warning;
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

        const standardFilter = filter;
        const scope = filter?.and?.find((item) => item.scope !== undefined)?.scope;

        if (filter?.and) {
            filter.and = filter.and.filter((item) => item.scope === undefined);
        }

        const where = gqlArgsToMikroOrmQuery({ search, filter: standardFilter }, this.repository);
        where.status = { $in: status };

        if (scope) {
            if (scope?.equal) {
                const scopeEqual = scope.equal;
                if (!scopes.find((scope) => isEqual(scope, scopeEqual))) {
                    throw new UnauthorizedException();
                }

                where.$or = [{ scope: { $eq: scopeEqual } }];
            } else if (scope.notEqual) {
                const scopeNotEqual = scope.notEqual;

                where.$or = [{ scope: { $in: scopes.filter((scope) => !isEqual(scope, scopeNotEqual)) } }];
            } else if (scope.isAnyOf) {
                for (const scopeItemInIsAnyOf of scope.isAnyOf) {
                    if (!scopes.find((scope) => isEqual(scope, scopeItemInIsAnyOf))) {
                        throw new UnauthorizedException();
                    }
                }

                where.$or = [{ scope: { $in: scope.isAnyOf } }];
            }
        } else {
            where.$or = [{ scope: { $in: scopes } }, { scope: { $eq: null } }];
        }

        const options: FindOptions<Warning> = { offset, limit };

        if (sort) {
            options.orderBy = sort.map((sortItem) => {
                return {
                    [sortItem.field]: sortItem.direction,
                };
            });
        }

        const [entities, totalCount] = await this.repository.findAndCount(where, options);
        return new PaginatedWarnings(entities, totalCount);
    }
}
