import { Readable } from "stream";

import { PipeMetadata } from "../pipes/importer-pipe.type";

export type StreamChunkAndMetadata = {
    chunk: Buffer | string;
    metadata: PipeMetadata<Record<string, unknown>>;
};
export abstract class DataStream {
    abstract getDataStreamAndMetadata(): Promise<Readable | null>;
}
