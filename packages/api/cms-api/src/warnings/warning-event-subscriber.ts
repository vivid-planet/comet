import { EntityName, EventArgs, EventSubscriber } from "@mikro-orm/core";
import { EntityClass, EntityManager, MikroORM } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { ModuleRef, Reflector } from "@nestjs/core";

import { FlatBlocks } from "../blocks/flat-blocks/flat-blocks";
import { ScopedEntityMeta } from "../user-permissions/decorators/scoped-entity.decorator";
import { ContentScope } from "../user-permissions/interfaces/content-scope.interface";
import { WarningService } from "./warning.service";

@Injectable()
export class WarningEventSubscriber implements EventSubscriber {
    constructor(
        readonly entityManager: EntityManager,
        private readonly orm: MikroORM,
        private readonly warningService: WarningService,
        private reflector: Reflector,
        private readonly moduleRef: ModuleRef,
    ) {
        entityManager.getEventManager().registerSubscriber(this);
    }

    getSubscribedEntities(): EntityName<unknown>[] {
        const rootBlockEntities: EntityName<unknown>[] = [];

        const entities = this.orm.config.get("entities") as EntityClass<unknown>[];
        for (const entity of entities) {
            const rootBlockEntityOptions = Reflect.getMetadata(`data:rootBlockEntityOptions`, entity);

            if (rootBlockEntityOptions) {
                rootBlockEntities.push(entity);
            }
        }
        return rootBlockEntities;
    }

    async afterUpdate(args: EventArgs<unknown>): Promise<void> {
        return this.handleUpdateAndCreate(args);
    }

    async afterCreate(args: EventArgs<unknown>): Promise<void> {
        return this.handleUpdateAndCreate(args);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private async handleUpdateAndCreate(args: EventArgs<any>): Promise<void> {
        const entity = args.meta.class;
        const definedProperties = args.meta.definedProperties;

        if (entity) {
            const keys = Reflect.getMetadata(`keys:rootBlock`, entity.prototype) || [];
            let scope: ContentScope | undefined = "scope" in definedProperties ? definedProperties.scope : undefined;

            if (!scope) {
                const scoped = this.reflector.getAllAndOverride<ScopedEntityMeta>("scopedEntity", [entity]);

                if (scoped) {
                    const service = this.moduleRef.get(scoped, { strict: false });
                    const scopedEntityScope = await service.getEntityScope(args.entity);
                    if (Array.isArray(scopedEntityScope)) {
                        throw new Error("Multiple scopes are not supported for warnings");
                    } else {
                        scope = scopedEntityScope;
                    }
                }
            }

            for (const key of keys) {
                const block = Reflect.getMetadata(`data:rootBlock`, entity.prototype, key);

                const flatBlocks = new FlatBlocks(args.entity[key], {
                    name: block.name,
                    visible: true,
                    rootPath: "root",
                });
                for (const node of flatBlocks.depthFirst()) {
                    const warnings = node.block.warnings();
                    await this.warningService.updateWarningsForBlock({
                        warnings,
                        scope,
                        sourceInfo: {
                            rootEntityName: entity.name,
                            rootColumnName: key,
                            targetId: args.entity.id,
                            rootPrimaryKey: args.meta.primaryKeys[0],
                            jsonPath: node.pathToString(),
                        },
                    });
                }
            }
        }
    }
}
