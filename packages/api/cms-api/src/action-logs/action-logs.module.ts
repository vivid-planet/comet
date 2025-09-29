import { MikroOrmModule } from "@mikro-orm/nestjs";
import { AnyEntity } from "@mikro-orm/postgresql";
import { DynamicModule, ExecutionContext, Module, Type } from "@nestjs/common";
import { ModuleRef, Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { Request } from "express";
import { ClsModule } from "nestjs-cls";

import { DISABLE_COMET_GUARDS_METADATA_KEY } from "../auth/decorators/disable-comet-guards.decorator";
import { User } from "../user-permissions/interfaces/user";
import { ActionLogsResolverFactory } from "./action-logs.resolver.factory";
import { ActionLogsService } from "./action-logs.service";
import { ActionLogsSubscriber } from "./action-logs.subscriber";
import { ActionLogsContextService } from "./action-logs-context.service";
import { ActionLog } from "./entities/action-log.entity";

@Module({
    imports: [
        MikroOrmModule.forFeature([ActionLog]),
        ClsModule.forRootAsync({
            useFactory: (reflector: Reflector, moduleRef: ModuleRef) => ({
                interceptor: {
                    mount: true,
                    setup: async (_cls, context: ExecutionContext) => {
                        const request: Request & { user: User } =
                            context.getType().toString() === "graphql"
                                ? GqlExecutionContext.create(context).getContext().req
                                : context.switchToHttp().getRequest();
                        const disableCometGuard = reflector.getAllAndOverride(DISABLE_COMET_GUARDS_METADATA_KEY, [
                            context.getHandler(),
                            context.getClass(),
                        ]);
                        if (disableCometGuard) return;

                        const service = moduleRef.get(ActionLogsContextService, { strict: false });
                        await service.setUserId(request.user.id);
                    },
                },
            }),
            inject: [Reflector, ModuleRef],
        }),
    ],
    providers: [ActionLogsService, ActionLogsContextService, ActionLogsSubscriber],
    exports: [ActionLogsService, ActionLogsContextService],
})
export class ActionLogsModule {
    static forFeature(entities: Array<Type<AnyEntity>>): DynamicModule {
        const resolvers = entities.map((entity) => ActionLogsResolverFactory.create(entity));
        return {
            module: ActionLogsModule,
            providers: [...resolvers],
        };
    }
}
