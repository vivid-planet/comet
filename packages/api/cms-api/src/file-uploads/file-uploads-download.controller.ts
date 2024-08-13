import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Controller, Get, GoneException, Headers, Inject, NotFoundException, Param, Res } from "@nestjs/common";
import { Response } from "express";

import { DisableCometGuards } from "../auth/decorators/disable-comet-guards.decorator";
import { BlobStorageBackendService } from "../blob-storage/backends/blob-storage-backend.service";
import { calculatePartialRanges, createHashedPath } from "../dam/files/files.utils";
import { DownloadParams, HashDownloadParams } from "./dto/file-uploads-download.params";
import { FileUpload } from "./entities/file-upload.entity";
import { FileUploadsConfig } from "./file-uploads.config";
import { FILE_UPLOADS_CONFIG } from "./file-uploads.constants";
import { FileUploadsService } from "./file-uploads.service";

@Controller("file-uploads")
export class FileUploadsDownloadController {
    constructor(
        @InjectRepository(FileUpload) private readonly fileUploadsRepository: EntityRepository<FileUpload>,
        @Inject(BlobStorageBackendService) private readonly blobStorageBackendService: BlobStorageBackendService,
        @Inject(FILE_UPLOADS_CONFIG) private readonly config: FileUploadsConfig,
        private readonly fileUploadsService: FileUploadsService,
    ) {}

    @Get(":hash/:id/:timeout")
    // TODO should this be public or private?
    @DisableCometGuards()
    async download(@Param() { hash, ...params }: HashDownloadParams, @Res() res: Response, @Headers("range") range?: string): Promise<void> {
        if (!this.isValidHash(hash, params)) {
            throw new NotFoundException();
        }

        if (Date.now() > params.timeout) {
            throw new GoneException();
        }

        const file = await this.fileUploadsRepository.findOne(params.id);

        if (!file) {
            throw new NotFoundException();
        }

        const filePath = createHashedPath(file.contentHash);
        const fileExists = await this.blobStorageBackendService.fileExists(this.config.directory, filePath);

        if (!fileExists) {
            throw new NotFoundException();
        }

        const headers = {
            "content-disposition": `attachment; filename="${file.name}"`,
            "content-type": file.mimetype,
            "last-modified": file.updatedAt?.toUTCString(),
            "content-length": file.size,
        };

        // https://medium.com/@vishal1909/how-to-handle-partial-content-in-node-js-8b0a5aea216
        let stream: NodeJS.ReadableStream;

        if (range) {
            const { start, end, contentLength } = calculatePartialRanges(file.size, range);

            if (start >= file.size || end >= file.size) {
                res.writeHead(416, {
                    "content-range": `bytes */${file.size}`,
                });
                res.end();
                return;
            }

            stream = await this.blobStorageBackendService.getPartialFile(
                this.config.directory,
                createHashedPath(file.contentHash),
                start,
                contentLength,
            );

            res.writeHead(206, {
                ...headers,
                "accept-ranges": "bytes",
                "content-range": `bytes ${start}-${end}/${file.size}`,
                "content-length": contentLength,
            });
        } else {
            stream = await this.blobStorageBackendService.getFile(this.config.directory, createHashedPath(file.contentHash));

            res.writeHead(200, headers);
        }

        stream.pipe(res);
    }

    private isValidHash(hash: string, params: DownloadParams): boolean {
        return hash === this.fileUploadsService.createHash(params);
    }
}
