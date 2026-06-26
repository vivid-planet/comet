import { AnyEntity, EntityManager, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Type } from "@nestjs/common";
import { Args, ID, Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { PaginatedActionLogs } from "../action-logs/dto/paginated-action-logs";
import { PaginatedActionLogsArgs } from "../action-logs/dto/paginated-action-logs.args";
import { ActionLog } from "../action-logs/entities/action-log.entity";
import { PgMementoActionLogsService } from "./pgmemento-action-logs.service";

/**
 * Creates the `actionLogs` / `actionLog` resolve fields for an audited entity.
 *
 * Drop-in replacement for the old `ActionLogsResolverFactory`: same GraphQL fields, same arguments,
 * same return types. Instead of querying the `ActionLog` table it delegates to the pgMemento read
 * model, which reconstructs the history from the database's audit log.
 */
export class PgMementoActionLogsResolverFactory {
    static create<T extends AnyEntity>(classRef: Type<T>) {
        @Resolver(() => classRef)
        class PgMementoEntityActionLogsResolver {
            constructor(
                readonly entityManager: EntityManager<PostgreSqlDriver>,
                readonly actionLogsService: PgMementoActionLogsService,
            ) {}

            @ResolveField(() => PaginatedActionLogs)
            async actionLogs(@Parent() node: T, @Args() { offset, limit, sort }: PaginatedActionLogsArgs): Promise<PaginatedActionLogs> {
                const { nodes, totalCount } = await this.actionLogsService.findManyForEntity({
                    entityName: classRef,
                    entityId: node.id,
                    offset,
                    limit,
                    sort,
                });
                return new PaginatedActionLogs(nodes as unknown as ActionLog[], totalCount);
            }

            @ResolveField(() => ActionLog)
            async actionLog(@Parent() node: T, @Args("id", { type: () => ID }) id: string): Promise<ActionLog> {
                const actionLog = await this.actionLogsService.findOneForEntity({ entityName: classRef, entityId: node.id, id });
                if (!actionLog) {
                    throw new Error(`ActionLog '${id}' not found for ${classRef.name} '${node.id}'`);
                }
                return actionLog as unknown as ActionLog;
            }
        }

        return PgMementoEntityActionLogsResolver;
    }
}
