import { FlatBlocks } from "@comet/cms-api";
import { EmitWarningsMeta } from "@comet/cms-api/lib/warnings/decorators/emit-warnings.decorator";
import { EntityName, EventArgs, EventSubscriber } from "@mikro-orm/core";
import { EntityClass, EntityManager, MikroORM } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { ModuleRef, Reflector } from "@nestjs/core";
import { WarningService } from "@src/warnings/warning.service";

import { WarningSeverity } from "./entities/warning-severity.enum";

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
            const emitWarnings = this.reflector.getAllAndOverride<EmitWarningsMeta>("emitWarnings", [entity]);

            if (rootBlockEntityOptions || emitWarnings) {
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

        // check if emitWarnings or rootBlockEntityOptions is defined, or both
        if (entity) {
            // check if it throws an error if emitWarnings is not defined
            const keys = Reflect.getMetadata(`keys:rootBlock`, entity.prototype) || [];
            for (const key of keys) {
                const block = Reflect.getMetadata(`data:rootBlock`, entity.prototype, key);

                const flatBlocks = new FlatBlocks(args.entity[key], {
                    name: block.name,
                    visible: true,
                    rootPath: "root",
                });
                for (const node of flatBlocks.depthFirst()) {
                    const warnings = node.block.warnings().map((warning) => ({
                        ...warning,
                        severity: WarningSeverity[warning.severity as keyof typeof WarningSeverity],
                    }));

                    await this.warningService.updateWarningsAndDeleteOutdated({
                        warnings,
                        type: "Block",
                        dependencyInfo: {
                            rootEntityName: entity.name,
                            rootColumnName: key,
                            targetId: args.entity.id,
                            rootPrimaryKey: args.meta.primaryKeys[0],
                            jsonPath: node.pathToString(),
                        },
                    });
                }
            }

            const emitWarnings = this.reflector.getAllAndOverride<EmitWarningsMeta>("emitWarnings", [entity]);
            if (emitWarnings) {
                const emitWarnings = this.reflector.getAllAndOverride<EmitWarningsMeta>("emitWarnings", [entity]);
                const repository = this.entityManager.getRepository(entity);

                const rows = await repository.find();

                for (const row of rows) {
                    const service = this.moduleRef.get(emitWarnings, { strict: false });
                    const warnings = (await service.emitWarnings(row)).map((warning) => ({
                        ...warning,
                        severity: WarningSeverity[warning.severity as keyof typeof WarningSeverity],
                    }));

                    await this.warningService.updateWarningsAndDeleteOutdated({
                        warnings,
                        type: "Entity",
                        dependencyInfo: {
                            rootEntityName: entity.name,
                            targetId: row.id,
                        },
                    });
                }
            }
        }
    }
}
