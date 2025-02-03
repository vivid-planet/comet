import { ReadStream } from "node:fs";

import { SdkStream } from "@smithy/types";
import { IncomingMessage } from "http";

import { DataStream } from "./data-stream";

export type FileStreamTypes = SdkStream<IncomingMessage> | ReadStream;

export interface FileStreamAndSize {
    fileStream: FileStreamTypes;
    fileName?: string;
    fileSize?: number;
}

export abstract class FileDataStream extends DataStream {
    async getFileStreamResult(fileStreamAndSize: FileStreamAndSize | null) {
        if (fileStreamAndSize) {
            return {
                dataStream: fileStreamAndSize.fileStream,
                additionalData: {
                    fileName: fileStreamAndSize.fileName,
                },
            };
        }

        return null;
    }
}
