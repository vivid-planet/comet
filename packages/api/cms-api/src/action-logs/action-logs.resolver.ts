import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { UserPermissionsService } from "../user-permissions/user-permissions.service";
import { ActionLogsUser } from "./dto/action-logs-user";
import { ActionLog } from "./entities/action-log.entity";

@Resolver(() => ActionLog)
export class ActionLogsResolver {
    constructor(private readonly userPermissionsService: UserPermissionsService) {}

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
