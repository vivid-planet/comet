import { Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ClsPluginBase } from "nestjs-cls";

import { DISABLE_COMET_GUARDS_METADATA_KEY } from "../auth/decorators/disable-comet-guards.decorator";
import { User } from "../user-permissions/interfaces/user";
import { ActionLogsContextModule } from "./action-logs-context.module";
import { ActionLogsContextService } from "./action-logs-context.service";

@Injectable()
export class ActionLogsContextPlugin extends ClsPluginBase {
    constructor() {
        super("action-logs-context-plugin");

        this.registerHooks({
            inject: [Reflector, ActionLogsContextService],
            useFactory: (reflector: Reflector, service: ActionLogsContextService) => ({
                afterSetup: async (_cls, initContext) => {
                    if (initContext.kind !== "interceptor" || service.hasUserId()) return;

                    const { ctx } = initContext;
                    const request: Request & { user: User } =
                        ctx.getType().toString() === "graphql" ? GqlExecutionContext.create(ctx).getContext().req : ctx.switchToHttp().getRequest();
                    const disableCometGuard = reflector.getAllAndOverride(DISABLE_COMET_GUARDS_METADATA_KEY, [ctx.getHandler(), ctx.getClass()]);
                    if (disableCometGuard) return;

                    await service.setUserId(request.user.id);
                },
            }),
        });

        this.imports.push(ActionLogsContextModule);
    }
}
