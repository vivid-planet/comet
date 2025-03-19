import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository, FindOptions } from "@mikro-orm/postgresql";
import { UnauthorizedException } from "@nestjs/common";
import { Args, ID, Query, Resolver } from "@nestjs/graphql";

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
        @Args() { status, search, filter, sort, offset, limit }: WarningsArgs,
        @GetCurrentUser() user: CurrentUser,
    ): Promise<PaginatedWarnings> {
        // TODO: Discuss, should this part be in admin or api? (niko mentioned that it is unusual to have an API request that delivers different data based on the user)
        const scopes = user.permissions.find(({ permission }) => permission === "warnings")?.contentScopes;
        if (!scopes) {
            throw new UnauthorizedException("User does not have the necessary permissions to view warnings");
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
                if (!scopes.find((scope) => JSON.stringify(scope) === JSON.stringify(scopeEqual))) {
                    throw new UnauthorizedException("User does not have the necessary permissions to view warnings");
                }

                where.$or = [{ scope: { $eq: scopeEqual } }];
            } else if (scope.notEqual) {
                const scopeNotEqual = scope.notEqual;

                where.$or = [{ scope: { $in: scopes.filter((scope) => JSON.stringify(scope) !== JSON.stringify(scopeNotEqual)) } }];
            } else if (scope.isAnyOf) {
                for (const scopeItem of scope.isAnyOf) {
                    if (!scopes.find((scope) => JSON.stringify(scope) === JSON.stringify(scopeItem))) {
                        throw new UnauthorizedException("User does not have the necessary permissions to view warnings");
                    }
                }

                where.$or = [{ scope: { $in: scope.isAnyOf } }];
            }
        } else {
            where.$or = [{ scope: { $in: scopes } }, { scope: { $eq: null } }];
        }

        // TODO: Adaptions for datagrid pro, currently it works only for $and filters

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
