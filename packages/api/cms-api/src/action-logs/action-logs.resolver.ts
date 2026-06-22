import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-scalars";

import { UserPermissionsService } from "../user-permissions/user-permissions.service";
import type { ActionLogSnapshot } from "./action-logs.decorator";
import { ActionLogsService } from "./action-logs.service";
import { ActionLogType } from "./dto/action-log-type.enum";
import { ActionLogsUser } from "./dto/action-logs-user";
import { ActionLog } from "./entities/action-log.entity";

@Resolver(() => ActionLog)
export class ActionLogsResolver {
    constructor(
        private readonly userPermissionsService: UserPermissionsService,
        private readonly actionLogsService: ActionLogsService,
    ) {}

    @ResolveField(() => GraphQLJSONObject, { nullable: true })
    snapshot(@Parent() actionLog: ActionLog): ActionLogSnapshot | undefined {
        return this.actionLogsService.migrateSnapshot(actionLog);
    }

    @ResolveField(() => ActionLogType, {
        description: "Derived from snapshot and version: snapshot null → Deleted, version 1 → Created, otherwise → Updated.",
    })
    type(@Parent() actionLog: ActionLog): ActionLogType {
        if (actionLog.snapshot == null) {
            return ActionLogType.Deleted;
        }
        if (actionLog.version === 1) {
            return ActionLogType.Created;
        }
        return ActionLogType.Updated;
    }

    @ResolveField(() => ActionLogsUser)
    async user(@Parent() actionLog: ActionLog): Promise<ActionLogsUser> {
        if (this.userPermissionsService.isSystemUser(actionLog.userId)) {
            return { id: actionLog.userId, name: actionLog.userId };
        }
        const user = await this.userPermissionsService.findUser(actionLog.userId);
        return user ? { id: user.id, name: user.name } : { id: actionLog.userId };
    }
}
