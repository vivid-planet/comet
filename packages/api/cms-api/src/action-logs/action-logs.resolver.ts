import { EntityManager, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { ForbiddenException, Inject } from "@nestjs/common";
import { Args, ID, Query, Resolver } from "@nestjs/graphql";

import { GetCurrentUser } from "../auth/decorators/get-current-user.decorator";
import { gqlArgsToMikroOrmQuery } from "../common/filter/mikro-orm";
import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { CurrentUser } from "../user-permissions/dto/current-user";
import { ACCESS_CONTROL_SERVICE } from "../user-permissions/user-permissions.constants";
import { AccessControlServiceInterface } from "../user-permissions/user-permissions.types";
import { ACTION_LOGS_METADATA_KEY, ActionLogMetadata } from "./action-logs.decorator";
import { PaginatedActionLogs } from "./dto/paginated-action-logs";
import { PaginatedActionLogsArgs } from "./dto/paginated-action-logs.args";
import { ActionLog } from "./entities/action-log.entity";

@RequiredPermission("actionLogs", { skipScopeCheck: true })
@Resolver(() => ActionLog)
export class ActionLogsResolver {
    constructor(
        private readonly entityManager: EntityManager<PostgreSqlDriver>,
        @Inject(ACCESS_CONTROL_SERVICE) private accessControlService: AccessControlServiceInterface,
    ) {}

    @Query(() => PaginatedActionLogs)
    async actionLogs(
        @Args() { scope, entityName, filter, offset, limit, sort }: PaginatedActionLogsArgs,
        @GetCurrentUser() user: CurrentUser,
    ): Promise<PaginatedActionLogs> {
        const metadata: ActionLogMetadata = Reflect.getMetadata(ACTION_LOGS_METADATA_KEY, this.entityManager.getMetadata(entityName).class.prototype);
        const hasPermission = metadata.requiredPermission.some((permission) => this.accessControlService.isAllowed(user, permission, scope));
        if (!hasPermission) throw new ForbiddenException();

        const where = gqlArgsToMikroOrmQuery({ filter }, this.entityManager.getMetadata(ActionLog));
        where.scope = scope ? { $contains: [scope] } : { $eq: null };

        const [entities, totalCount] = await this.entityManager.findAndCount(ActionLog, where, {
            offset,
            limit,
            orderBy: sort?.map(({ field, direction }) => ({ [field]: direction })),
        });
        return new PaginatedActionLogs(entities, totalCount);
    }

    @Query(() => ActionLog)
    async actionLog(@Args("id", { type: () => ID }) id: string, @GetCurrentUser() user: CurrentUser): Promise<ActionLog> {
        const row = await this.entityManager.findOneOrFail(ActionLog, { id });

        const metadata: ActionLogMetadata = Reflect.getMetadata(
            ACTION_LOGS_METADATA_KEY,
            this.entityManager.getMetadata(row.entityName).class.prototype,
        );
        const hasPermission = metadata.requiredPermission.some((permission) =>
            row.scope
                ? row.scope.some((scope) => this.accessControlService.isAllowed(user, permission, scope))
                : this.accessControlService.isAllowed(user, permission),
        );
        if (!hasPermission) throw new ForbiddenException();

        return row;
    }
}
