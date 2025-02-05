import { LoggerService } from "@nestjs/common";

import { DataSource } from "./data-source.enum";

export interface DataStreamAndMetaData {
    dataStream: NodeJS.ReadableStream;
    params?: Record<string, unknown>;
    additionalData?: Record<string, unknown>;
}

export type DataStreamClass = { new (): DataStream };

export abstract class DataStream {
    abstract dataSource: DataSource;
    abstract getDataStreamsAndMetaData({ logger }: { logger: LoggerService }): Promise<DataStreamAndMetaData | null>;
}
