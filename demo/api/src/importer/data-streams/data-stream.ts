import { PipeMetadata } from "../pipes/importer-pipe.type";

export interface DataStreamAndMetadata<T> {
    dataStream: NodeJS.ReadableStream;
    metadata: PipeMetadata<T>;
}

export abstract class DataStream<T> {
    abstract getDataStreamAndMetadata(): Promise<DataStreamAndMetadata<T> | null>;
}
