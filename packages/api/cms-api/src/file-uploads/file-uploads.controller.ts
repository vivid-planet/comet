import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Controller, forwardRef, Get, Inject, NotFoundException, Param, Post, Res, Type, UploadedFile, UseInterceptors } from "@nestjs/common";
import { Response } from "express";
import rimraf from "rimraf";

import { DisableCometGuards } from "../auth/decorators/disable-comet-guards.decorator";
import { BlobStorageBackendService } from "../blob-storage/backends/blob-storage-backend.service";
import { FileUploadInput } from "../dam/files/dto/file-upload.input";
import { createHashedPath } from "../dam/files/files.utils";
import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { FileUpload } from "./entities/file-upload.entity";
import { FileUploadsConfig } from "./file-uploads.config";
import { FILE_UPLOADS_CONFIG } from "./file-uploads.constants";
import { FileUploadsService } from "./file-uploads.service";
import { FileUploadsFileInterceptor } from "./file-uploads-file.interceptor";

export function createFileUploadsController(options: { public: boolean }): Type<unknown> {
    @Controller("file-uploads")
    class BaseFileUploadsController {
        constructor(
            @InjectRepository(FileUpload) private readonly fileUploadsRepository: EntityRepository<FileUpload>,
            @Inject(forwardRef(() => BlobStorageBackendService)) private readonly blobStorageBackendService: BlobStorageBackendService,
            @Inject(FILE_UPLOADS_CONFIG) private readonly config: FileUploadsConfig,
            private readonly fileUploadsService: FileUploadsService,
            private readonly entityManager: EntityManager,
        ) {}

        @Post("upload")
        @UseInterceptors(FileUploadsFileInterceptor("file"))
        async upload(@UploadedFile() file: FileUploadInput): Promise<FileUpload> {
            const fileUpload = await this.fileUploadsService.upload(file);

            await this.entityManager.flush();

            rimraf(file.path, (error) => {
                if (error) {
                    console.error("An error occurred when removing the file: ", error);
                }
            });

            return fileUpload;
        }

        @Get("download/:id")
        @RequiredPermission(["fileUploads"], { skipScopeCheck: true })
        async downloadFileById(@Param("id") id: string, @Res() res: Response): Promise<void> {
            const file = await this.fileUploadsRepository.findOne(id);

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

    if (options.public) {
        @DisableCometGuards()
        class PublicFileUploadsController extends BaseFileUploadsController {}

        return PublicFileUploadsController;
    }

    @RequiredPermission("fileUploads", { skipScopeCheck: true })
    class PrivateFileUploadsController extends BaseFileUploadsController {}

    return PrivateFileUploadsController;
}
