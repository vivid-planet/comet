import { EntityName, EventArgs, EventSubscriber } from "@mikro-orm/core";
import { EntityClass, EntityManager, MikroORM } from "@mikro-orm/postgresql";
import { Injectable, Type } from "@nestjs/common";
import { INJECTABLE_WATERMARK } from "@nestjs/common/constants";
import { ModuleRef, Reflector } from "@nestjs/core";

import { FlatBlocks } from "../blocks/flat-blocks/flat-blocks";
import { CreateWarningsMeta, CreateWarningsServiceInterface } from "./decorators/create-warnings.decorator";
import { CreateWarningInput } from "./dto/create-warning.input";
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
        const subscribedEntities: EntityName<unknown>[] = [];

        const entities = this.orm.config.get("entities") as EntityClass<unknown>[];
        for (const entity of entities) {
            const rootBlockEntityOptions = Reflect.getMetadata(`data:rootBlockEntityOptions`, entity);
            const createWarnings = this.reflector.getAllAndOverride<CreateWarningsMeta>("createWarnings", [entity]);

            if (rootBlockEntityOptions || createWarnings) {
                subscribedEntities.push(entity);
            }
        }

        return subscribedEntities;
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

        if (entity) {
            const keys = Reflect.getMetadata(`keys:rootBlock`, entity.prototype) || [];
            for (const key of keys) {
                const block = Reflect.getMetadata(`data:rootBlock`, entity.prototype, key);

                const flatBlocks = new FlatBlocks(args.entity[key], {
                    name: block.name,
                    visible: true,
                    rootPath: "root",
                });
                for (const node of flatBlocks.depthFirst()) {
                    const warnings = node.block.warnings();

                    await this.warningService.saveWarningsAndDeleteOutdated({
                        warnings,
                        type: "Block",
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

            const createWarnings = this.reflector.getAllAndOverride<CreateWarningsMeta>("createWarnings", [entity]);
            if (createWarnings) {
                const repository = this.entityManager.getRepository(entity);

                const rows = await repository.find();

                for (const row of rows) {
                    let warnings: CreateWarningInput[] = [];
                    if (this.isService(createWarnings)) {
                        const service = this.moduleRef.get(createWarnings, { strict: false });

                        if (service.createWarnings) {
                            warnings = await service.createWarnings(row);
                        }
                    } else {
                        warnings = await createWarnings(row);
                    }
                    await this.warningService.saveWarningsAndDeleteOutdated({
                        warnings,
                        type: "Entity",
                        sourceInfo: {
                            rootEntityName: entity.name,
                            rootPrimaryKey: args.meta.primaryKeys[0],
                            targetId: row.id,
                        },
                    });
                }
            }
        }
    }

    private isService(meta: CreateWarningsMeta): meta is Type<CreateWarningsServiceInterface> {
        // Check if class has @Injectable() decorator -> if true it's a service class else it's a function
        return Reflect.hasMetadata(INJECTABLE_WATERMARK, meta);
    }
}
