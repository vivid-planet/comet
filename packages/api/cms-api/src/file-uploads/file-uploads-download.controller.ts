import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Controller, Get, GoneException, Inject, NotFoundException, Param, Res } from "@nestjs/common";
import { Response } from "express";

import { DisableCometGuards } from "../auth/decorators/disable-comet-guards.decorator";
import { BlobStorageBackendService } from "../blob-storage/backends/blob-storage-backend.service";
import { createHashedPath } from "../dam/files/files.utils";
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
    async download(@Param() { hash, ...params }: HashDownloadParams, @Res() res: Response): Promise<void> {
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

        res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);
        res.setHeader("Content-Type", file.mimetype);
        res.setHeader("Last-Modified", file.updatedAt?.toUTCString());
        res.setHeader("Content-Length", file.size.toString());

        // TODO add partial content support?
        const stream = await this.blobStorageBackendService.getFile(this.config.directory, filePath);
        stream.pipe(res);
    }

    private isValidHash(hash: string, params: DownloadParams): boolean {
        return hash === this.fileUploadsService.createHash(params);
    }
}
