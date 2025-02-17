import { EntityManager } from "@mikro-orm/core";
import { Logger } from "@nestjs/common";
import { DataStream, DataStreamAndMetadata } from "@src/importer/data-streams/data-stream";
import { pipeline, Transform } from "stream";

export class ProductImporter {
    private readonly logger = new Logger(ProductImporter.name);
    dataStream: DataStreamAndMetadata | null = null;
    name = "rawProductImport";
    transformPipes: Transform[] = [];

    constructor(private readonly em: EntityManager) {
        this.transformPipes = [
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
        this.logger.log("row: ", row);
        return callback(null);
    }
}
