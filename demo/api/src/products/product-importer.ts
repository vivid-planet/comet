import { EntityManager } from "@mikro-orm/core";
import { Logger } from "@nestjs/common";
import { DataStream, DataStreamAndMetadata } from "@src/importer/data-streams/data-stream";
import { ImporterEntityClass } from "@src/importer/entities/base-target.entity";
import { CsvParseAndTransformPipes } from "@src/importer/pipes/parsers/csv-parser-and-transform.composite-pipe";
import { pipeline, Transform } from "stream";

import { RawProduct } from "./entities/raw-product.entity";

export class ProductImporter {
    private readonly logger = new Logger(ProductImporter.name);
    dataStream: DataStreamAndMetadata | null = null;
    name = "rawProductImport";
    targetEntity: ImporterEntityClass = RawProduct;
    transformPipes: Transform[] = [];

    constructor(private readonly em: EntityManager) {
        this.logger = new Logger("product-importer");
        const parsePipes = new CsvParseAndTransformPipes(this.targetEntity, em).getPipes(this.logger, { encoding: "utf-8" });
        this.transformPipes = [
            ...parsePipes,
            new Transform({
                objectMode: true,
                transform: this.displayData.bind(this),
            }),
        ];
    }

    async init({ dataStream }: { dataStream: DataStream }): Promise<void> {
        this.dataStream = await dataStream.getDataStreamAndMetadata();
    }

    async executeRun(): Promise<boolean> {
        const dataStream = this.dataStream;
        if (dataStream) {
            return new Promise((resolve, reject) => {
                return pipeline([dataStream.dataStream, ...this.transformPipes], (err) => {
                    this.transformPipes.map((stream) => stream.end());
                    if (err) {
                        reject(err);
                    } else {
                        this.logger.log("DataStream piped successfully");
                        resolve(true);
                    }
                });
            });
        }
        return false;
    }

    async displayData(row: unknown, encoding: string, callback: (error?: Error | null, data?: object[]) => void): Promise<void> {
        this.logger.log("row: ", JSON.stringify(row, null, 2));
        return callback(null);
    }
}
