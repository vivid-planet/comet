import type { FilterQuery } from "@mikro-orm/core/typings";
import { AnyEntity, EntityManager, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Type } from "@nestjs/common";
import { Args, ID, Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { ActionLogsService } from "./action-logs.service";
import { PaginatedActionLogs } from "./dto/paginated-action-logs";
import { PaginatedActionLogsArgs } from "./dto/paginated-action-logs.args";
import { ActionLog } from "./entities/action-log.entity";

export class ActionLogsResolverFactory {
    static create<T extends AnyEntity>(classRef: Type<T>) {
        @Resolver(() => classRef)
        class ActionLogsResolver {
            constructor(
                readonly entityManager: EntityManager<PostgreSqlDriver>,
                readonly service: ActionLogsService,
            ) {}

            @ResolveField(() => PaginatedActionLogs)
            async actionLogs(@Parent() node: T, @Args() { offset, limit, sort }: PaginatedActionLogsArgs): Promise<PaginatedActionLogs> {
                const scope = await this.service.getScopeFromEntity(node);
                const where: FilterQuery<ActionLog> = {
                    scope: scope ? { $contains: scope } : { $eq: null },
                    entityName: classRef.name,
                    entityId: node.id,
                };

                const [entities, totalCount] = await this.entityManager.findAndCount(ActionLog, where, {
                    offset,
                    limit,
                    orderBy: sort?.map(({ field, direction }) => ({ [field]: direction })),
                });
                return new PaginatedActionLogs(entities, totalCount);
            }

            @ResolveField(() => ActionLog)
            async actionLog(@Parent() node: T, @Args("id", { type: () => ID }) id: string): Promise<ActionLog> {
                const scope = await this.service.getScopeFromEntity(node);

                return this.entityManager.findOneOrFail(ActionLog, {
                    id,
                    scope: scope ? { $contains: scope } : { $eq: null },
                    entityName: classRef.name,
                    entityId: node.id,
                });
            }
        }

        return ActionLogsResolver;
    }
}
