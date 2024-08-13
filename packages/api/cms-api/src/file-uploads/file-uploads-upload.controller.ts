import { EntityManager } from "@mikro-orm/postgresql";
import { Controller, Headers, Inject, Post, Type, UploadedFile, UseInterceptors } from "@nestjs/common";
import rimraf from "rimraf";

import { DisableCometGuards } from "../auth/decorators/disable-comet-guards.decorator";
import { FileUploadInput } from "../dam/files/dto/file-upload.input";
import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { FileUpload } from "./entities/file-upload.entity";
import { FileUploadsConfig } from "./file-uploads.config";
import { FILE_UPLOADS_CONFIG } from "./file-uploads.constants";
import { FileUploadsService } from "./file-uploads.service";
import { FileUploadsFileInterceptor } from "./file-uploads-file.interceptor";

type FileUploadsUploadResponse = Pick<FileUpload, "id" | "name" | "size" | "mimetype" | "contentHash" | "createdAt" | "updatedAt"> & {
    downloadUrl?: string;
};

export function createFileUploadsUploadController(options: { public: boolean }): Type<unknown> {
    @Controller("file-uploads")
    class BaseFileUploadsUploadController {
        constructor(
            private readonly fileUploadsService: FileUploadsService,
            private readonly entityManager: EntityManager,
            @Inject(FILE_UPLOADS_CONFIG) private readonly config: FileUploadsConfig,
        ) {}

        @Post("upload")
        @UseInterceptors(FileUploadsFileInterceptor("file"))
        async upload(
            @UploadedFile() file: FileUploadInput,
            @Headers("x-relative-file-upload-urls") relativeUrls: string | undefined,
        ): Promise<FileUploadsUploadResponse> {
            const fileUpload = await this.fileUploadsService.upload(file);

            await this.entityManager.flush();

            rimraf(file.path, (error) => {
                if (error) {
                    console.error("An error occurred when removing the file: ", error);
                }
            });

            let downloadUrl: string | undefined;

            if (this.config.download) {
                downloadUrl = this.fileUploadsService.createDownloadUrl(fileUpload, { relativeUrls: Boolean(relativeUrls) });
            }

            return {
                ...fileUpload,
                downloadUrl,
            };
        }
    }

    if (options.public) {
        @DisableCometGuards()
        class PublicFileUploadsUploadController extends BaseFileUploadsUploadController {}

        return PublicFileUploadsUploadController;
    }

    @RequiredPermission("fileUploads", { skipScopeCheck: true })
    class PrivateFileUploadsUploadController extends BaseFileUploadsUploadController {}

    return PrivateFileUploadsUploadController;
}
