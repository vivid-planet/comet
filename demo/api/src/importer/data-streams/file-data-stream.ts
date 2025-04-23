import { ReadStream } from "node:fs";

import { SdkStream } from "@smithy/types";
import { IncomingMessage } from "http";

import { DataStream } from "./data-stream";

export type FileStream = SdkStream<IncomingMessage> | ReadStream;

export interface FileStreamAndSize {
    fileStream: FileStream;
    fileName?: string;
    fileSize?: number;
}

export type FileStreamAndMetadata = {
    dataStream: FileStream;
    metadata: {
        fileName?: string;
        fileSize?: number;
    };
};

export abstract class FileDataStream extends DataStream {
    getFileStreamResult(fileStreamAndSize: FileStreamAndSize): FileStreamAndMetadata {
        return {
            dataStream: fileStreamAndSize.fileStream,
            metadata: {
                fileName: fileStreamAndSize.fileName,
            },
        };
    }
}
