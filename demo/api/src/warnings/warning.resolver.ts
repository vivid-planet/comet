import { AffectedEntity, gqlArgsToMikroOrmQuery, RequiredPermission } from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository, FindOptions } from "@mikro-orm/postgresql";
import { Args, ID, Query, Resolver } from "@nestjs/graphql";

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
    async warnings(@Args() { status, search, filter, sort, offset, limit }: WarningsArgs): Promise<PaginatedWarnings> {
        const where = gqlArgsToMikroOrmQuery({ search, filter }, this.repository);
        where.status = { $in: status };

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
