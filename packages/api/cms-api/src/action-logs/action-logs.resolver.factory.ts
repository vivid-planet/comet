import type { FilterQuery, ObjectQuery } from "@mikro-orm/core/typings";
import { AnyEntity, EntityManager, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Type } from "@nestjs/common";
import { Args, ID, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { CRUD_GENERATOR_METADATA_KEY, type CrudGeneratorOptions } from "../common/decorators/crud-generator.decorator";
import { gqlSortToMikroOrmOrderBy, searchToMikroOrmQuery } from "../common/filter/mikro-orm";
import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { actionLogFilterToWhere } from "./action-logs-filter.utils";
import { EntityActionLogsArgs } from "./dto/entity-action-logs.args";
import { PaginatedActionLogs } from "./dto/paginated-action-logs";
import { PaginatedActionLogsArgs } from "./dto/paginated-action-logs.args";
import { ActionLog } from "./entities/action-log.entity";

function classNameToInstanceName(className: string): string {
    return className[0].toLocaleLowerCase() + className.slice(1);
}

export class ActionLogsResolverFactory {
    static create<T extends AnyEntity>(classRef: Type<T>) {
        const crudGeneratorOptions = Reflect.getMetadata(CRUD_GENERATOR_METADATA_KEY, classRef) as CrudGeneratorOptions | undefined;
        if (!crudGeneratorOptions) {
            throw new Error(
                `Entity ${classRef.name} registered with ActionLogsModule.forFeature() must declare a @CrudGenerator() decorator so the action log resolver can derive its requiredPermission.`,
            );
        }
        const requiredPermission = crudGeneratorOptions.requiredPermission;
        const listQueryName = `${classNameToInstanceName(classRef.name)}ActionLogs`;

        @Resolver(() => classRef)
        @RequiredPermission(requiredPermission)
        class ActionLogsResolver {
            constructor(readonly entityManager: EntityManager<PostgreSqlDriver>) {}

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

            @Query(() => PaginatedActionLogs, { name: listQueryName })
            async list(@Args() { scope, search, filter, offset, limit, sort }: EntityActionLogsArgs): Promise<PaginatedActionLogs> {
                const andFilters: ObjectQuery<ActionLog>[] = [{ entityName: classRef.name }];

                if (Object.keys(scope).length > 0) {
                    // Action log rows for entities without a scope have scope=NULL; match those too so
                    // unscoped entities still surface their logs when the page is rendered inside a scoped layout.
                    andFilters.push({ $or: [{ scope: null }, { scope: { $contains: [scope] } }] });
                }

                if (search) {
                    andFilters.push(searchToMikroOrmQuery(search, ["userId"]));
                }

                if (filter) {
                    andFilters.push(actionLogFilterToWhere(filter));
                }

                const [entities, totalCount] = await this.entityManager.findAndCount(
                    ActionLog,
                    { $and: andFilters },
                    {
                        offset,
                        limit,
                        orderBy: sort ? gqlSortToMikroOrmOrderBy(sort) : { createdAt: "DESC" },
                    },
                );
                return new PaginatedActionLogs(entities, totalCount);
            }
        }

        return ActionLogsResolver;
    }
}
