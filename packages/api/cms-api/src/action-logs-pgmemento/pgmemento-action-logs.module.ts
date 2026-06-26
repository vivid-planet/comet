import type { AnyEntity } from "@mikro-orm/postgresql";
import { type DynamicModule, Module, type Type } from "@nestjs/common";

import { PgMementoActionLogsResolver } from "./pgmemento-action-logs.resolver";
import { PgMementoActionLogsResolverFactory } from "./pgmemento-action-logs.resolver.factory";
import { PgMementoActionLogsService } from "./pgmemento-action-logs.service";
import { PgMementoSessionSubscriber } from "./pgmemento-session.subscriber";
import { PgMementoSetupService } from "./pgmemento-setup.service";

@Module({})
class PgMementoActionLogsFeatureModule {}

/**
 * Prototype replacement for `ActionLogsModule`, backed by pgMemento.
 *
 * Public API is identical, so switching is a one-line import change:
 *   - `forRoot()` registers the session subscriber (who-did-it), the read model and the audit setup.
 *   - `forFeature([Entity, ...])` adds the `actionLogs` / `actionLog` resolve fields to entities.
 */
export class PgMementoActionLogsModule {
    static forRoot(): DynamicModule {
        return {
            module: PgMementoActionLogsModule,
            providers: [PgMementoSessionSubscriber, PgMementoSetupService, PgMementoActionLogsService, PgMementoActionLogsResolver],
            exports: [PgMementoActionLogsService],
        };
    }

    static forFeature(entities: Array<Type<AnyEntity>>): DynamicModule {
        const resolvers = entities.map((entity) => PgMementoActionLogsResolverFactory.create(entity));
        return {
            module: PgMementoActionLogsFeatureModule,
            providers: [PgMementoActionLogsService, ...resolvers],
        };
    }
}
