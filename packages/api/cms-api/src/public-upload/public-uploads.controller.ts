import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Controller, forwardRef, Get, Inject, NotFoundException, Param, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { Response } from "express";
import rimraf from "rimraf";

import { DisableCometGuards } from "../auth/decorators/disable-comet-guards.decorator";
import { BlobStorageBackendService } from "../blob-storage/backends/blob-storage-backend.service";
import { createHashedPath } from "../dam/files/files.utils";
import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { PublicUploadFileUploadInterface } from "./dto/public-upload-file-upload.interface";
import { PublicUpload } from "./entities/public-upload.entity";
import { PublicUploadConfig } from "./public-upload.config";
import { PUBLIC_UPLOAD_CONFIG } from "./public-upload.constants";
import { PublicUploadFileInterceptor } from "./public-upload-file.interceptor";
import { PublicUploadsService } from "./public-uploads.service";

@Controller("public-upload/files")
export class PublicUploadsController {
    constructor(
        @InjectRepository(PublicUpload) private readonly publicUploadsRepository: EntityRepository<PublicUpload>,
        @Inject(forwardRef(() => BlobStorageBackendService)) private readonly blobStorageBackendService: BlobStorageBackendService,
        @Inject(PUBLIC_UPLOAD_CONFIG) private readonly config: PublicUploadConfig,
        private readonly publicUploadsService: PublicUploadsService,
        private readonly entityManager: EntityManager,
    ) {}

    @Post("upload")
    @UseInterceptors(PublicUploadFileInterceptor("file"))
    @DisableCometGuards()
    async upload(@UploadedFile() file: PublicUploadFileUploadInterface): Promise<PublicUpload> {
        const publicUploadsFile = await this.publicUploadsService.upload(file);

        await this.entityManager.flush();

        rimraf(file.path, (error) => {
            if (error) {
                console.error("An error occurred when removing the file: ", error);
            }
        });

        return publicUploadsFile;
    }

    @Get("download/:id")
    @RequiredPermission(["publicUploads"], { skipScopeCheck: true })
    async downloadFileById(@Param("id") id: string, @Res() res: Response): Promise<void> {
        const file = await this.publicUploadsRepository.findOne(id);

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

        const stream = await this.blobStorageBackendService.getFile(this.config.directory, filePath);
        stream.pipe(res);
    }
}
