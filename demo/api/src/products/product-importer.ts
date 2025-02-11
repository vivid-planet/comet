import { EntityManager } from "@mikro-orm/core";
import { Injectable, Logger } from "@nestjs/common";
import { DataStream, DataStreamAndMetadata } from "@src/importer/data-streams/data-stream";
import { pipeline, Transform } from "stream";

@Injectable()
export class ProductImporter {
    private readonly logger = new Logger("product-importer");
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
        this.dataStream = await dataStream.getDataStreamsAndMetadata();
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
                            this.logger.log("DataStream piped successfully");
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
