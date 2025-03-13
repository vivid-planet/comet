import { createReadStream, existsSync, statSync } from "node:fs";

import { Logger } from "@nestjs/common";
import path from "path";

import { FileDataStream } from "./file-data-stream";

export type FileStreamMetadata = {
    fileName?: string;
    fileSize?: number;
};

export class LocalFileDataStream extends FileDataStream<FileStreamMetadata> {
    private readonly logger = new Logger();
    fileKey: string;

    constructor(fileKey: string) {
        super();
        this.fileKey = fileKey;
    }

    async getDataStreamAndMetadata() {
        const dataStreamAndSize = await this.getFileStreamAndSizeOfLocalFile({ filePath: this.fileKey });
        if (!dataStreamAndSize) {
            return null;
        }
        const result = await this.getFileStreamResult(dataStreamAndSize);
        const additionalData: FileStreamMetadata = { fileName: result.additionalData.fileName, fileSize: dataStreamAndSize?.fileSize };
        return {
            dataStream: result.dataStream,
            metadata: { additionalData },
        };
    }

    protected async getFileStreamAndSizeOfLocalFile({ filePath, encoding }: { filePath?: string; encoding?: BufferEncoding }) {
        if (!filePath) {
            this.logger.error(`File ${filePath} does not exist`);
            return null;
        }
        // check if file exists
        if (!existsSync(filePath)) {
            this.logger.error(`File ${filePath} does not exist`);
            return null;
        }

        const fileSize = statSync(filePath).size;
        // gzip file must be read as binary, without encoding
        const fileStream = createReadStream(filePath, filePath.endsWith(".gz") && !encoding ? {} : { encoding: encoding || "utf-8" });
        this.logger.log(`Providing fileStreams for local file (${filePath} fileSize: ${fileSize}).`);
        return { fileSize, fileStream, fileName: path.basename(filePath) };
    }
}
