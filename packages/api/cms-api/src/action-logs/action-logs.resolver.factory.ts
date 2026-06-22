import type { FilterQuery } from "@mikro-orm/core/typings";
import { AnyEntity, EntityManager, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Type } from "@nestjs/common";
import { Args, ID, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { AffectedEntity } from "../user-permissions/decorators/affected-entity.decorator";
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
                readonly actionLogsService: ActionLogsService,
            ) {}

            @ResolveField(() => PaginatedActionLogs)
            async actionLogs(@Parent() node: T, @Args() { offset, limit, sort }: PaginatedActionLogsArgs): Promise<PaginatedActionLogs> {
                const where: FilterQuery<ActionLog> = {
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
                return this.entityManager.findOneOrFail(ActionLog, {
                    id,
                    entityName: classRef.name,
                    entityId: node.id,
                });
            }

            @Mutation(() => classRef, {
                name: `restore${classRef.name}`,
                description: `Restore the ${classRef.name} to the state stored in the given action log's snapshot.`,
            })
            @AffectedEntity(classRef)
            async restore(@Args("id", { type: () => ID }) id: string, @Args("actionLogId", { type: () => ID }) actionLogId: string): Promise<T> {
                const actionLog = await this.entityManager.findOneOrFail(ActionLog, {
                    id: actionLogId,
                    entityName: classRef.name,
                    entityId: id,
                });
                return this.actionLogsService.restoreSnapshot(actionLog) as Promise<T>;
            }
        }

        return ActionLogsResolver;
    }
}
