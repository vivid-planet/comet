import { Connection, EntityManager, IDatabaseDriver, Reference } from "@mikro-orm/core";
import { LoggerService } from "@nestjs/common";
import { ImporterPipe, PipeData, PipeMetadata } from "@src/importer/pipes/importer-pipe.type";
import slugify from "slugify";
import { Transform, TransformCallback } from "stream";
import { v4 } from "uuid";

import { ProductCategory } from "./entities/product-category.entity";

export class ProductPrePersistPipe implements ImporterPipe {
    constructor(private readonly em: EntityManager<IDatabaseDriver<Connection>>) {}

    getPipe(logger: LoggerService) {
        return new ProductPrePersist(this.em, logger);
    }
}

export class ProductPrePersist extends Transform {
    private persistedEntitiesAmount: number;

    constructor(private readonly em: EntityManager<IDatabaseDriver<Connection>>, private readonly logger: LoggerService) {
        super({ writableObjectMode: true, objectMode: true });
        this.persistedEntitiesAmount = 0;
    }

    getPersistedEntitiesAmount() {
        return this.persistedEntitiesAmount;
    }

    async _transform(inputDataAndMetadata: { data: PipeData; metadata: PipeMetadata }, encoding: BufferEncoding, callback: TransformCallback) {
        try {
            const { data } = inputDataAndMetadata;
            const slug = slugify(`${data.category}`, { lower: true });

            const categoryData = {
                id: v4(),
                title: data.category,
                slug,
                position: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const category = await this.em.upsert(ProductCategory, categoryData, {
                onConflictFields: ["slug"],
                onConflictAction: "merge",
                onConflictExcludeFields: ["id"],
            });

            const outputData = { ...inputDataAndMetadata, data: { ...data, category: Reference.create(category) } };

            this.push(outputData);
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (err: any) {
            await this.logger.error(`Error parsing Data: ${err}`);
            return callback(err);
        }

        callback();
    }
}
