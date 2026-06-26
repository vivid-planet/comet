import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { ActionLogType } from "../action-logs/dto/action-log-type.enum";
import { ActionLogsUser } from "../action-logs/dto/action-logs-user";
import { ActionLog } from "../action-logs/entities/action-log.entity";
import { UserPermissionsService } from "../user-permissions/user-permissions.service";
import { MappedActionLog } from "./mapped-action-log";

/**
 * Provides the computed fields of the `ActionLog` GraphQL type (`type`, `user`, `previousVersion`).
 *
 * This is the pgMemento counterpart of the old `ActionLogsResolver`. It registers the same
 * `@Resolver(() => ActionLog)` field resolvers, so the GraphQL schema is identical — only the data
 * source differs. The parent here is always a `MappedActionLog` produced by the read model, which
 * already carries the resolved values, so these resolvers stay trivial.
 */
@Resolver(() => ActionLog)
export class PgMementoActionLogsResolver {
    constructor(private readonly userPermissionsService: UserPermissionsService) {}

    @ResolveField(() => ActionLog, {
        nullable: true,
        description: "The most recent earlier action log entry for the same entity. Null when this is the first version.",
    })
    previousVersion(@Parent() actionLog: MappedActionLog): MappedActionLog | null {
        return actionLog.previousVersion;
    }

    @ResolveField(() => ActionLogType, {
        description: "Derived from the pgMemento operation: insert → Created, delete/truncate → Deleted, otherwise → Updated.",
    })
    type(@Parent() actionLog: MappedActionLog): ActionLogType {
        return actionLog.type;
    }

    @ResolveField(() => ActionLogsUser)
    async user(@Parent() actionLog: MappedActionLog): Promise<ActionLogsUser> {
        if (this.userPermissionsService.isSystemUser(actionLog.userId)) {
            return { id: actionLog.userId, name: actionLog.userId };
        }
        const user = await this.userPermissionsService.findUser(actionLog.userId);
        return user ? { id: user.id, name: user.name } : { id: actionLog.userId };
    }
}
