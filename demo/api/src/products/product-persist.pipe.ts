import { Connection, EntityManager, FilterQuery, IDatabaseDriver } from "@mikro-orm/core";
import { LoggerService } from "@nestjs/common";
import { ImporterPipe, PipeData, PipeMetadata } from "@src/importer/pipes/importer-pipe.type";
import { plainToInstance } from "class-transformer";
import { Transform, TransformCallback } from "stream";
import { v4 } from "uuid";

import { Product } from "./entities/product.entity";

export class ProductPersistPipe implements ImporterPipe {
    constructor(private readonly em: EntityManager<IDatabaseDriver<Connection>>) {}

    getPipe(logger: LoggerService) {
        return new ProductPersist(this.em, logger);
    }
}

export class ProductPersist extends Transform {
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
            const { category, ...input } = data;
            const entityInstance = plainToInstance(Product, input);
            const { colors, tagsWithStatus, variants, createdAt, ...productData } = entityInstance;

            const updateQuery: FilterQuery<object> | undefined = { slug: data.slug };

            const record: Product | null = updateQuery ? await this.em.findOne(Product, updateQuery, { fields: ["id"] }) : null;

            if (record) {
                await this.logger.log(`Existing record for ${JSON.stringify(updateQuery)} with id ${record.id} found, updating...`);
                // keeping the id from the input data (in the DataTransformer plainToInstance always creates a new Entity instance, which is populated with the new id)
                data.id = record.id;
                await this.em.nativeUpdate(Product.name, { id: record.id }, { ...productData, id: data.id, updatedAt: new Date() });
            } else {
                // in case the id is not provided
                data.id = data?.id || v4();
                await this.logger.log(
                    `${updateQuery ? `No record for query ${JSON.stringify(updateQuery)} found` : "No query provided"}, inserting with id ${
                        data.id
                    }...`,
                );
                await this.em.insert(Product, {
                    ...productData,
                    createdAt: new Date(),
                });
                await this.logger.log(`Inserted record with id ${data.id}`, false);
            }
            this.persistedEntitiesAmount++;
            await this.logger.log(`Persisted entities amount: ${this.persistedEntitiesAmount}`);
            // clear entity manager to prevent memory leak
            if (this.persistedEntitiesAmount % 100 === 0) {
                this.em.clear();
            }
            const outputData = inputDataAndMetadata;
            outputData.metadata.persistedEntitiesAmount = this.persistedEntitiesAmount;
            this.push(outputData);
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (err: any) {
            await this.logger.error(`Error parsing Data: ${err}`);
            this.emit("error", err);
            return callback(err);
        }

        callback();
    }
}
