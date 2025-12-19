import { MikroOrmModule } from "@mikro-orm/nestjs";
import { type AnyEntity } from "@mikro-orm/postgresql";
import { type DynamicModule, type Type } from "@nestjs/common";

import { ActionLogsResolverFactory } from "./action-logs.resolver.factory";
import { ActionLogsService } from "./action-logs.service";
import { ActionLogsSubscriber } from "./action-logs.subscriber";
import { ActionLogsFeatureModule } from "./action-logs-feature.module";
import { ActionLog } from "./entities/action-log.entity";

export class ActionLogsModule {
    static forRoot(): DynamicModule {
        return {
            module: ActionLogsModule,
            imports: [MikroOrmModule.forFeature([ActionLog]), ActionLogsFeatureModule],
            providers: [ActionLogsSubscriber, ActionLogsService],
        };
    }

    static forFeature(entities: Array<Type<AnyEntity>>): DynamicModule {
        const resolvers = entities.map((entity) => ActionLogsResolverFactory.create(entity));
        return {
            module: ActionLogsFeatureModule,
            providers: [...resolvers],
        };
    }
}
