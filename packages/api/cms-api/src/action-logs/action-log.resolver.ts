import { EntityManager, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { ActionLogAction } from "./dto/action-log-action.enum";
import { ActionLog } from "./entities/action-log.entity";

@Resolver(() => ActionLog)
export class ActionLogResolver {
    constructor(private readonly entityManager: EntityManager<PostgreSqlDriver>) {}

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

    @ResolveField(() => ActionLog, { nullable: true })
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
}
