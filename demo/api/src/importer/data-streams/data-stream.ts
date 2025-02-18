export interface DataStreamAndMetadata {
    dataStream: NodeJS.ReadableStream;
    params?: Record<string, unknown>;
    additionalData?: Record<string, unknown>;
}

export abstract class DataStream {
    abstract getDataStreamAndMetadata(): Promise<DataStreamAndMetadata | null>;
}
