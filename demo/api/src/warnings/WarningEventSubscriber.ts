import { FlatBlocks } from "@comet/blocks-api";
import { EntityManager, EventArgs, EventSubscriber, MikroORM } from "@mikro-orm/core";
import { EntityClass } from "@mikro-orm/core/typings";
import { Injectable } from "@nestjs/common";
import { WarningService } from "@src/warnings/warning.service";

@Injectable()
export class WarningEventSubscriber implements EventSubscriber {
    constructor(private readonly orm: MikroORM, entityManager: EntityManager, private readonly warningService: WarningService) {
        entityManager.getEventManager().registerSubscriber(this);
    }

    async afterUpdate(args: EventArgs<unknown>): Promise<void> {
        return this.handleUpdateAndCreate(args);
    }

    async afterCreate(args: EventArgs<unknown>): Promise<void> {
        return this.handleUpdateAndCreate(args);
    }

    private async handleUpdateAndCreate(args: EventArgs<any>): Promise<void> {
        const entities = this.orm.config.get("entities") as EntityClass<any>[];
        const entity = entities.find((item) => item.name === args.entity.constructor.name);

        if (entity) {
            const rootBlockEntityOptions = Reflect.getMetadata(`data:rootBlockEntityOptions`, entity);

            if (rootBlockEntityOptions) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const keys = Reflect.getMetadata(`keys:rootBlock`, (entity as any).prototype) || [];
                for (const key of keys) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const block = Reflect.getMetadata(`data:rootBlock`, (entity as any).prototype, key);

                    const flatBlocks = new FlatBlocks(args.entity[key], {
                        name: block.name,
                        visible: true,
                        rootPath: "root",
                    });
                    for (const node of flatBlocks.depthFirst()) {
                        const warnings = node.block.warnings();

                        this.warningService.updateWarningsForBlock(warnings, {
                            rootEntityName: entity.name,
                            rootColumnName: key,
                            targetId: args.entity.id,
                            rootPrimaryKey: "id",
                        });
                    }
                }
            }
        }
    }
}
