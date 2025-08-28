import { EntityName, EventArgs, EventSubscriber } from "@mikro-orm/core";
import { EntityClass, EntityManager, EntityRepository, MikroORM } from "@mikro-orm/postgresql";
import { Injectable, Type } from "@nestjs/common";
import { INJECTABLE_WATERMARK } from "@nestjs/common/constants";
import { ModuleRef, Reflector } from "@nestjs/core";
import { BlockWarning, BlockWarningsServiceInterface } from "src/blocks/block";

import { ROOT_BLOCK_KEYS_METADATA_KEY, ROOT_BLOCK_METADATA_KEY } from "../blocks/decorators/root-block";
import { ROOT_BLOCK_ENTITY_METADATA_KEY } from "../blocks/decorators/root-block-entity";
import { FlatBlocks } from "../blocks/flat-blocks/flat-blocks";
import { SCOPED_ENTITY_METADATA_KEY, ScopedEntityMeta } from "../user-permissions/decorators/scoped-entity.decorator";
import { ContentScope } from "../user-permissions/interfaces/content-scope.interface";
import { CREATE_WARNINGS_METADATA_KEY, CreateWarningsMeta, CreateWarningsServiceInterface } from "./decorators/create-warnings.decorator";
import { WarningData } from "./dto/warning-data";
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
            const rootBlockEntityOptions = Reflect.getMetadata(ROOT_BLOCK_ENTITY_METADATA_KEY, entity);
            const createWarnings = this.reflector.getAllAndOverride<CreateWarningsMeta>(CREATE_WARNINGS_METADATA_KEY, [entity]);

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
        const definedProperties = args.meta.definedProperties;

        if (entity) {
            const keys = Reflect.getMetadata(ROOT_BLOCK_KEYS_METADATA_KEY, entity.prototype) || [];
            let scope: ContentScope | undefined = "scope" in definedProperties ? definedProperties.scope : undefined;

            if (!scope) {
                const scoped = this.reflector.getAllAndOverride<ScopedEntityMeta>(SCOPED_ENTITY_METADATA_KEY, [entity]);

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
                const block = Reflect.getMetadata(ROOT_BLOCK_METADATA_KEY, entity.prototype, key);

                const flatBlocks = new FlatBlocks(args.entity[key], {
                    name: block.name,
                    visible: true,
                    rootPath: "root",
                });
                for (const node of flatBlocks.depthFirst()) {
                    const startDate = new Date();
                    const warningsOrWarningsService = await node.block.warnings();
                    let warnings: BlockWarning[] = [];

                    if (this.isBlockWarningService(warningsOrWarningsService)) {
                        const warningsService = warningsOrWarningsService;
                        const service: BlockWarningsServiceInterface = await this.moduleRef.get(warningsService, { strict: false });

                        warnings = await service.warnings(node.block);
                    } else {
                        warnings = warningsOrWarningsService;
                    }

                    const sourceInfo = {
                        rootEntityName: entity.name,
                        rootColumnName: key,
                        targetId: args.entity.id,
                        rootPrimaryKey: args.meta.primaryKeys[0],
                        jsonPath: node.pathToString(),
                    };

                    await this.warningService.saveWarnings({
                        warnings,
                        sourceInfo,
                        scope,
                    });
                    await this.warningService.deleteOutdatedWarnings({ date: startDate, sourceInfo });
                }
            }

            const createWarnings = this.reflector.getAllAndOverride<CreateWarningsMeta>(CREATE_WARNINGS_METADATA_KEY, [entity]);
            if (createWarnings && args.entity.id) {
                const repository: EntityRepository<{ id: string; scope: ContentScope }> = this.entityManager.getRepository(entity);

                const row = await repository.findOneOrFail(args.entity.id);

                let warnings: WarningData[] = [];
                if (this.isService(createWarnings)) {
                    const service = this.moduleRef.get(createWarnings, { strict: false });
                    warnings = await service.createWarnings(row);
                } else {
                    warnings = await createWarnings(row);
                }
                const startDate = new Date();
                const sourceInfo = {
                    rootEntityName: entity.name,
                    rootPrimaryKey: args.meta.primaryKeys[0],
                    targetId: row.id,
                };
                await this.warningService.saveWarnings({
                    warnings,
                    sourceInfo,
                    scope: row.scope,
                });
                await this.warningService.deleteOutdatedWarnings({ date: startDate, sourceInfo });
            }
        }
    }

    private isService(meta: CreateWarningsMeta): meta is Type<CreateWarningsServiceInterface> {
        // Check if class has @Injectable() decorator -> if true it's a service class else it's a function
        return Reflect.hasMetadata(INJECTABLE_WATERMARK, meta);
    }
    private isBlockWarningService(
        transformResponse: Type<BlockWarningsServiceInterface> | BlockWarning[],
    ): transformResponse is Type<BlockWarningsServiceInterface> {
        return Reflect.hasMetadata(INJECTABLE_WATERMARK, transformResponse);
    }
}
