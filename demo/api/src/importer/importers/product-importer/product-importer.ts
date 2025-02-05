import { EntityManager } from "@mikro-orm/core";
import { Injectable, Logger, LoggerService } from "@nestjs/common";
import { DataStream, DataStreamAndMetaData } from "@src/importer/data-streams/data-stream";
import { ImporterEntityClass } from "@src/importer/entities/base-target.entity";
import { CsvParseAndTransformPipes } from "@src/importer/pipes/parsers/csv-parser-and-transform.composite-pipe";
import { RawProduct } from "@src/products/entities/raw-product.entity";
import { pipeline, Transform } from "stream";

@Injectable()
export class ProductImporter {
    dataStream: DataStreamAndMetaData | null = null;
    name = "rawProductImport";
    targetEntity: ImporterEntityClass = RawProduct;
    transformPipes: Transform[] = [];
    logger: LoggerService;

    constructor(private readonly em: EntityManager) {
        this.logger = new Logger("product-importer");
        const parsePipes = new CsvParseAndTransformPipes(this.targetEntity, em).getPipes(this.logger, {});
        this.transformPipes = [
            ...parsePipes,
            new Transform({
                objectMode: true,
                transform: this.displayData.bind(this),
            }),
        ];
    }

    async init({ dataStream }: { dataStream: DataStream }): Promise<void> {
        this.dataStream = await dataStream.getDataStreamsAndMetaData({ logger: this.logger });
    }

    getName(): string {
        return this.name;
    }

    async executeRun(): Promise<boolean> {
        if (this.dataStream) {
            return new Promise((resolve, reject) => {
                if (this.dataStream) {
                    return pipeline([this.dataStream.dataStream, ...this.transformPipes], (err) => {
                        this.transformPipes.map((stream) => stream.end());
                        if (err) {
                            reject(err);
                        } else {
                            console.log("DataStream piped successfully");
                            resolve(true);
                        }
                    });
                }
            });
        }
        return false;
    }

    async displayData(row: unknown, encoding: string, callback: (error?: Error | null, data?: object[]) => void): Promise<void> {
        this.logger.log("row: ", row);
        return callback(null);
    }
}
