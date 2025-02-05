import { LoggerService } from "@nestjs/common";

export interface DataStreamAndMetaData {
    dataStream: NodeJS.ReadableStream;
    params?: Record<string, unknown>;
    additionalData?: Record<string, unknown>;
}

export type DataStreamClass = { new (): DataStream };

export abstract class DataStream {
    abstract getDataStreamsAndMetaData({ logger }: { logger: LoggerService }): Promise<DataStreamAndMetaData | null>;
}
