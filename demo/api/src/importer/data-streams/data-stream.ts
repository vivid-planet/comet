export interface DataStreamAndMetadata {
    dataStream: NodeJS.ReadableStream;
    params?: Record<string, unknown>;
    additionalData?: Record<string, unknown>;
}

export type DataStreamClass = { new (): DataStream };

export abstract class DataStream {
    abstract getDataStreamsAndMetadata(): Promise<DataStreamAndMetadata | null>;
}
