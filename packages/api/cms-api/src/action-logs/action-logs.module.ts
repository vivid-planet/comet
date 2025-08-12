import { MikroOrmModule } from "@mikro-orm/nestjs";
import { ExecutionContext, Module } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { Request } from "express";
import { ClsModule } from "nestjs-cls";

import { User } from "../user-permissions/interfaces/user";
import { ActionLogsResolver } from "./action-logs.resolver";
import { ActionLogsService } from "./action-logs.service";
import { ActionLogsSubscriber } from "./action-logs.subscriber";
import { ActionLog } from "./entities/action-log.entity";

@Module({
    imports: [
        MikroOrmModule.forFeature([ActionLog]),
        ClsModule.forRootAsync({
            useFactory: (reflector: Reflector) => ({
                interceptor: {
                    mount: true,
                    setup: async (cls, context: ExecutionContext) => {
                        const request: Request & { user: User } =
                            context.getType().toString() === "graphql"
                                ? GqlExecutionContext.create(context).getContext().req
                                : context.switchToHttp().getRequest();
                        const disableCometGuard = reflector.getAllAndOverride("disableCometGuards", [context.getHandler(), context.getClass()]);
                        if (disableCometGuard) return;

                        await new ActionLogsService(cls).setUserId(request.user.id);
                    },
                },
            }),
            inject: [Reflector],
        }),
    ],
    providers: [ActionLogsService, ActionLogsSubscriber, ActionLogsResolver],
    exports: [ActionLogsService],
})
export class ActionLogsModule {}
