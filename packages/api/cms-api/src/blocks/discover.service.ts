import { Block, RootBlockEntityOptions } from "@comet/blocks-api";
import { EntityMetadata, EntityRepository, MikroORM } from "@mikro-orm/core";
import { EntityClass } from "@mikro-orm/core/typings";
import { Injectable } from "@nestjs/common";

interface DiscoverResult {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    repository: EntityRepository<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata: EntityMetadata<any>;
    options: RootBlockEntityOptions;
    column: string;
    block: Block;
}

@Injectable()
export class DiscoverService {
    constructor(private readonly orm: MikroORM) {}

    discoverRootBlocks(): DiscoverResult[] {
        const ret: DiscoverResult[] = [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const entities = this.orm.config.get("entities") as EntityClass<any>[];
        const metadataStorage = this.orm.em.getMetadata();

        entities.forEach((entity) => {
            const rootBlockEntityOptions = Reflect.getMetadata(`data:rootBlockEntityOptions`, entity);
            if (rootBlockEntityOptions) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const keys = Reflect.getMetadata(`keys:rootBlock`, (entity as any).prototype) || [];
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
}
