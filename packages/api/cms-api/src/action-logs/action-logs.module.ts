import { MikroOrmModule } from "@mikro-orm/nestjs";
import { type AnyEntity } from "@mikro-orm/postgresql";
import { type DynamicModule, type Type } from "@nestjs/common";

import { ActionLogsResolverFactory } from "./action-logs.resolver.factory";
import { ActionLogsSubscriber } from "./action-logs.subscriber";
import { ActionLogsCommonModule } from "./action-logs-common.module";
import { ActionLog } from "./entities/action-log.entity";

export class ActionLogsModule {
    static forRoot(): DynamicModule {
        return {
            module: ActionLogsModule,
            imports: [MikroOrmModule.forFeature([ActionLog]), ActionLogsCommonModule],
            providers: [ActionLogsSubscriber],
        };
    }

    static forFeature(entities: Array<Type<AnyEntity>>): DynamicModule {
        const resolvers = entities.map((entity) => ActionLogsResolverFactory.create(entity));
        return {
            module: ActionLogsCommonModule,
            providers: [...resolvers],
        };
    }
}
