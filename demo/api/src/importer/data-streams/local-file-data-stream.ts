import { createReadStream, existsSync, statSync } from "node:fs";

import { Logger } from "@nestjs/common";
import path from "path";

import { DataStreamAndMetadata } from "./data-stream";
import { FileDataStream } from "./file-data-stream";

export class LocalFileDataStream extends FileDataStream {
    private readonly logger = new Logger();
    fileKey: string;

    constructor(fileKey: string) {
        super();
        this.fileKey = fileKey;
    }

    async getDataStreamsAndMetadata(): Promise<DataStreamAndMetadata | null> {
        const dataStreamAndSize = await this.getFileStreamAndSizeOfLocalFile({ filePath: this.fileKey });
        return this.getFileStreamResult(dataStreamAndSize);
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
        // gzip filed must be read as binary, without encoding
        const fileStream = createReadStream(filePath, filePath.endsWith(".gz") && !encoding ? {} : { encoding: encoding || "utf-8" });
        this.logger.log(`Providing fileStreams for local file (${filePath} fileSize: ${fileSize}).`);
        return { fileSize, fileStream, fileName: path.basename(filePath) };
    }
}
