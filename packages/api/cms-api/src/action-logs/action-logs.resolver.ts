import { EntityManager, type FilterQuery, type ObjectQuery, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { UnauthorizedException } from "@nestjs/common";
import { Args, ID, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import isEqual from "lodash.isequal";

import { GetCurrentUser } from "../auth/decorators/get-current-user.decorator";
import { gqlSortToMikroOrmOrderBy, searchToMikroOrmQuery } from "../common/filter/mikro-orm";
import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { CurrentUser } from "../user-permissions/dto/current-user";
import { UserPermissionsService } from "../user-permissions/user-permissions.service";
import { actionLogFilterToWhere } from "./action-logs-filter.utils";
import { ActionLogAction } from "./dto/action-log-action.enum";
import { ActionLogsUser } from "./dto/action-logs-user";
import { GlobalActionLogsArgs } from "./dto/global-action-logs.args";
import { PaginatedActionLogs } from "./dto/paginated-action-logs";
import { ActionLog } from "./entities/action-log.entity";

@Resolver(() => ActionLog)
@RequiredPermission(["actionLog"], { skipScopeCheck: true })
export class ActionLogsResolver {
    constructor(
        private readonly entityManager: EntityManager<PostgreSqlDriver>,
        private readonly userPermissionsService: UserPermissionsService,
    ) {}

    @Query(() => PaginatedActionLogs, {
        description: "Returns action log entries across all entities. Requires the `actionLog` permission.",
    })
    async actionLogs(
        @Args() { search, filter, scopes, offset, limit, sort }: GlobalActionLogsArgs,
        @GetCurrentUser() user: CurrentUser,
    ): Promise<PaginatedActionLogs> {
        const allowedScopesForUser = user.permissions.find(({ permission }) => permission === "actionLog")?.contentScopes;
        for (const scope of scopes) {
            if (!allowedScopesForUser?.find((allowedScope) => isEqual(allowedScope, scope))) {
                throw new UnauthorizedException("Scopes were passed that the user does not have permission to");
            }
        }

        const andFilters: ObjectQuery<ActionLog>[] = [];

        if (search) {
            andFilters.push(searchToMikroOrmQuery(search, ["entityName", "userId"]));
        }

        if (filter) {
            andFilters.push(actionLogFilterToWhere(filter));
        }

        // Use $contained (<@) so a row's scope must be a subset of one of the user's allowed scopes.
        // This naturally handles partially-scoped entities (e.g. scope only by domain) without sub-scope expansion.
        andFilters.push({
            $or: [...scopes.map((scope) => ({ scope: { $contained: [scope] } })), { scope: null }],
        });

        const where: FilterQuery<ActionLog> = { $and: andFilters };

        const [entities, totalCount] = await this.entityManager.findAndCount(ActionLog, where, {
            offset,
            limit,
            orderBy: sort ? gqlSortToMikroOrmOrderBy(sort) : { createdAt: "DESC" },
        });

        return new PaginatedActionLogs(entities, totalCount);
    }

    @Query(() => ActionLog, {
        description: "Returns a single action log entry by id. Requires the `actionLog` permission.",
    })
    async actionLog(@Args("id", { type: () => ID }) id: string): Promise<ActionLog> {
        return this.entityManager.findOneOrFail(ActionLog, { id });
    }

    @ResolveField(() => ActionLogAction, {
        description: "Derived from snapshot and version: snapshot null → Deleted, version 1 → Created, otherwise → Updated.",
    })
    action(@Parent() actionLog: ActionLog): ActionLogAction {
        if (actionLog.snapshot == null) {
            return ActionLogAction.Deleted;
        }
        if (actionLog.version === 1) {
            return ActionLogAction.Created;
        }
        return ActionLogAction.Updated;
    }

    @ResolveField(() => ActionLog, {
        nullable: true,
        description:
            "The most recent earlier action log entry for the same entity. Null when this is the first version. Used to render a diff against the prior snapshot.",
    })
    async previousVersion(@Parent() actionLog: ActionLog): Promise<ActionLog | null> {
        if (actionLog.version <= 1) {
            return null;
        }
        return this.entityManager.findOne(
            ActionLog,
            { entityName: actionLog.entityName, entityId: actionLog.entityId, version: { $lt: actionLog.version } },
            { orderBy: { version: "DESC" } },
        );
    }

    @ResolveField(() => ActionLogsUser)
    async user(@Parent() actionLog: ActionLog): Promise<ActionLogsUser> {
        try {
            const user = await this.userPermissionsService.getUser(actionLog.userId);
            return { id: user.id, name: user.name };
        } catch {
            return { id: actionLog.userId };
        }
    }
}
