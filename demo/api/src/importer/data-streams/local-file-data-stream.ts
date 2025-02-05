import { createReadStream, existsSync, statSync } from "node:fs";

import { Injectable, LoggerService } from "@nestjs/common";
import path from "path";

import { DataStreamAndMetaData } from "./data-stream";
import { FileDataStream } from "./file-data-stream";

@Injectable()
export class LocalFileDataStream extends FileDataStream {
    fileKey: string;

    constructor(fileKey: string) {
        super();
        this.fileKey = fileKey;
    }

    async getDataStreamsAndMetaData({ logger }: { logger: LoggerService }): Promise<DataStreamAndMetaData | null> {
        const dataStreamAndSize = await this.getFileStreamAndSizeOfLocalFile({ filePath: this.fileKey, logger });
        return this.getFileStreamResult(dataStreamAndSize);
    }

    protected async getFileStreamAndSizeOfLocalFile({
        filePath,
        logger,
        encoding,
    }: {
        filePath?: string;
        logger: LoggerService;
        encoding?: BufferEncoding;
    }) {
        if (!filePath) {
            await logger.error(new Error(`File ${filePath} does not exist`));
            return null;
        }
        // check if file exists
        if (!existsSync(filePath)) {
            await logger.error(new Error(`File ${filePath} does not exist`));
            return null;
        }

        const fileSize = statSync(filePath).size;
        // gzip filed must be read as binary, without encoding
        const fileStream = createReadStream(filePath, filePath.endsWith(".gz") && !encoding ? {} : { encoding: encoding || "utf-8" });
        logger.log(`Providing fileStreams for local file (${filePath} fileSize: ${fileSize}).`);
        return { fileSize, fileStream, fileName: path.basename(filePath) };
    }
}
