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

export abstract class FileDataStream<T> extends DataStream<T> {
    async getFileStreamResult(fileStreamAndSize: FileStreamAndSize) {
        return {
            dataStream: fileStreamAndSize.fileStream,
            additionalData: {
                fileName: fileStreamAndSize.fileName,
            },
        };
    }
}
