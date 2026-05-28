import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { UserPermissionsService } from "../user-permissions/user-permissions.service";
import { ActionLogUser } from "./dto/action-log-user";
import { ActionLog } from "./entities/action-log.entity";

@Resolver(() => ActionLog)
export class ActionLogResolver {
    constructor(private readonly userPermissionsService: UserPermissionsService) {}

    @ResolveField(() => ActionLogUser, { nullable: true })
    async user(@Parent() actionLog: ActionLog): Promise<ActionLogUser | null> {
        try {
            const user = await this.userPermissionsService.getUser(actionLog.userId);
            return { id: user.id, name: user.name };
        } catch {
            return null;
        }
    }
}
