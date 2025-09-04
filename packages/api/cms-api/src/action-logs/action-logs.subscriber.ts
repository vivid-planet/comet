import { AnyEntity, ChangeSet, ChangeSetType, EntityManager, EventSubscriber, FlushEventArgs, PostgreSqlDriver, raw } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

import { SCOPED_ENTITY_METADATA_KEY, ScopedEntityMeta } from "../user-permissions/decorators/scoped-entity.decorator";
import { ContentScope } from "../user-permissions/interfaces/content-scope.interface";
import { ACTION_LOGS_METADATA_KEY, ActionLogMetadata } from "./action-logs.decorator";
import { ActionLogsService } from "./action-logs.service";
import { ActionLog } from "./entities/action-log.entity";

@Injectable()
export class ActionLogsSubscriber implements EventSubscriber {
    constructor(
        private readonly entityManager: EntityManager<PostgreSqlDriver>,
        private readonly service: ActionLogsService,
        private readonly moduleRef: ModuleRef,
    ) {
        entityManager.getEventManager().registerSubscriber(this);
    }

    async onFlush(args: FlushEventArgs): Promise<void> {
        const changeSets = args.uow.getChangeSets();
        for (const changeSet of changeSets.filter((changeSet) =>
            Reflect.hasOwnMetadata(ACTION_LOGS_METADATA_KEY, changeSet.entity.constructor.prototype),
        )) {
            const entity = await this.createEntity(changeSet);
            if (!entity) continue;
            args.uow.computeChangeSet(entity, ChangeSetType.CREATE);
            args.uow.recomputeSingleChangeSet(entity);
        }
    }

    async createEntity(changeSet: ChangeSet<AnyEntity>): Promise<ActionLog | null> {
        const entityName = changeSet.entity.constructor.name;
        const entityMetadata = this.entityManager.getMetadata(entityName);
        if (!entityMetadata) return null;

        const actionLogsMetadata: ActionLogMetadata | undefined = Reflect.getMetadata(
            ACTION_LOGS_METADATA_KEY,
            changeSet.entity.constructor.prototype,
        );
        if (!actionLogsMetadata) return null;

        if (entityMetadata.primaryKeys.length != 1) {
            console.error(`entity '${entityMetadata}' doesn't have a single primary key`);
            return null;
        }
        const entityId = changeSet.entity[entityMetadata.primaryKeys[0]];

        let scope: ContentScope[] | undefined;
        if (Reflect.hasOwnMetadata(SCOPED_ENTITY_METADATA_KEY, changeSet.entity.constructor.prototype)) {
            const scopedEntityMetadata: ScopedEntityMeta = Reflect.getMetadata(SCOPED_ENTITY_METADATA_KEY, changeSet.entity.constructor.prototype);
            const service = this.moduleRef.get(scopedEntityMetadata, { strict: false });
            const scopedEntityScope = await service.getEntityScope(changeSet.entity);

            scope = Array.isArray(scopedEntityScope) ? scopedEntityScope : [scopedEntityScope];
        }

        return this.entityManager.create(
            ActionLog,
            {
                userId: await this.service.getUserId(),
                entityName,
                entityId,
                snapshot: changeSet.type !== ChangeSetType.DELETE ? changeSet.entity.toObject() : undefined,
                version: raw(
                    `(${this.entityManager
                        .createQueryBuilder(ActionLog)
                        .select(raw('COALESCE(MAX("version"), 0) + 1'))
                        .where({
                            entityName,
                            entityId,
                        })
                        .getFormattedQuery()})`,
                ),
                scope,
            },
            { persist: false },
        );
    }
}
