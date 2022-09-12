import { Block, RootBlockEntityOptions } from "@comet/blocks-api";
import { EntityMetadata, EntityRepository, MikroORM } from "@mikro-orm/core";
import { EntityClass } from "@mikro-orm/core/typings";
import { Injectable } from "@nestjs/common";

interface DiscoverRootBlocksResult {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    repository: EntityRepository<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata: EntityMetadata<any>;
    options: RootBlockEntityOptions;
    column: string;
    block: Block;
}

interface DiscoverAllEntitiesResult {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    repository: EntityRepository<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata: EntityMetadata<any>;
}

@Injectable()
export class DiscoverService {
    constructor(private readonly orm: MikroORM) {}

    discoverRootBlocks(): DiscoverRootBlocksResult[] {
        const ret: DiscoverRootBlocksResult[] = [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const entities = this.orm.config.get("entities") as EntityClass<any>[];
        const metadataStorage = this.orm.em.getMetadata();

        entities.forEach((entity) => {
            const rootBlockEntityOptions = Reflect.getMetadata(`data:rootBlockEntityOptions`, entity);
            if (rootBlockEntityOptions) {
                console.log("DiscoverService rootBlockEntityOptions ", rootBlockEntityOptions);
                rootBlockEntityOptions?.isVisible?.(entity);

                // console.log("entities ", entity);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const keys = Reflect.getMetadata(`keys:rootBlock`, (entity as any).prototype) || [];
                // console.log("keys ", keys);
                for (const key of keys) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const block = Reflect.getMetadata(`data:rootBlock`, (entity as any).prototype, key);
                    ret.push({
                        repository: this.orm.em.getRepository(entity),
                        metadata: metadataStorage.get(entity.name),
                        options: rootBlockEntityOptions,
                        column: key,
                        block,
                    });
                }
            }
        });
        return ret;
    }

    discoverAllEntities(): DiscoverAllEntitiesResult[] {
        const ret: DiscoverAllEntitiesResult[] = [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const entities = this.orm.config.get("entities") as EntityClass<any>[];
        const metadataStorage = this.orm.em.getMetadata();

        entities.forEach((entity) => {
            console.log("DiscoverService entity ", entity);
            console.log("tableName ", metadataStorage.get(entity.name).tableName);
            console.log("entityName ", metadataStorage.get(entity.name).name);
            console.log("primaryKeys ", metadataStorage.get(entity.name).primaryKeys);

            ret.push({
                repository: this.orm.em.getRepository(entity),
                metadata: metadataStorage.get(entity.name),
            });
        });

        return ret;
    }
}
