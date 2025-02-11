export interface DataStreamAndMetaData {
    dataStream: NodeJS.ReadableStream;
    params?: Record<string, unknown>;
    additionalData?: Record<string, unknown>;
}

export type DataStreamClass = { new (): DataStream };

export abstract class DataStream {
    abstract getDataStreamsAndMetaData(): Promise<DataStreamAndMetaData | null>;
}
