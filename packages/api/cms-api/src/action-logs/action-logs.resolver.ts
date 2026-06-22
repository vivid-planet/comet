import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-scalars";

import { UserPermissionsService } from "../user-permissions/user-permissions.service";
import type { ActionLogSnapshot } from "./action-log-snapshot-migration";
import { ActionLogSnapshotMigrationService } from "./action-log-snapshot-migration.service";
import { ActionLogType } from "./dto/action-log-type.enum";
import { ActionLogsUser } from "./dto/action-logs-user";
import { ActionLog } from "./entities/action-log.entity";

@Resolver(() => ActionLog)
export class ActionLogsResolver {
    constructor(
        private readonly userPermissionsService: UserPermissionsService,
        private readonly snapshotMigrationService: ActionLogSnapshotMigrationService,
    ) {}

    @ResolveField(() => GraphQLJSONObject, { nullable: true })
    async snapshot(@Parent() actionLog: ActionLog): Promise<ActionLogSnapshot | undefined> {
        if (actionLog.snapshot == null) {
            return undefined;
        }
        return this.snapshotMigrationService.migrateSnapshot({
            snapshot: actionLog.snapshot,
            entityName: actionLog.entityName,
            createdAt: actionLog.createdAt,
        });
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
