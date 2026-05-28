import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { ActionLogAction } from "./dto/action-log-action.enum";
import { ActionLog } from "./entities/action-log.entity";

@Resolver(() => ActionLog)
export class ActionLogsResolver {
    @ResolveField(() => ActionLogAction)
    action(@Parent() actionLog: ActionLog): ActionLogAction {
        if (actionLog.snapshot == null) {
            return ActionLogAction.Deleted;
        }
        if (actionLog.version === 1) {
            return ActionLogAction.Created;
        }
        return ActionLogAction.Updated;
    }
}
