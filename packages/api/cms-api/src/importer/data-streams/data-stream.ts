import { Readable } from "stream";

import { PipeMetadata } from "../pipes/importer-pipe.type";

export type StreamChunkAndMetadata = {
    chunk: Buffer | string;
    metadata: PipeMetadata;
};
export abstract class ImporterDataStream {
    abstract getDataStreamAndMetadata(): Promise<Readable | null>;
}
