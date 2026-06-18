import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { UserPermissionsService } from "../user-permissions/user-permissions.service";
import { ActionLogAction } from "./dto/action-log-action.enum";
import { ActionLogsUser } from "./dto/action-logs-user";
import { ActionLog } from "./entities/action-log.entity";

@Resolver(() => ActionLog)
export class ActionLogsResolver {
    constructor(private readonly userPermissionsService: UserPermissionsService) {}

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

    @ResolveField(() => ActionLogsUser)
    async user(@Parent() actionLog: ActionLog): Promise<ActionLogsUser> {
        try {
            const user = await this.userPermissionsService.findUserOrThrow(actionLog.userId);
            return { id: user.id, name: user.name };
        } catch {
            return { id: actionLog.userId };
        }
    }
}
