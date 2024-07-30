import { EntityManager } from "@mikro-orm/postgresql";
import { Controller, Post, Type, UploadedFile, UseInterceptors } from "@nestjs/common";
import rimraf from "rimraf";

import { DisableCometGuards } from "../auth/decorators/disable-comet-guards.decorator";
import { FileUploadInput } from "../dam/files/dto/file-upload.input";
import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { FileUpload } from "./entities/file-upload.entity";
import { FileUploadsService } from "./file-uploads.service";
import { FileUploadsFileInterceptor } from "./file-uploads-file.interceptor";

export function createFileUploadsController(options: { public: boolean }): Type<unknown> {
    @Controller("file-uploads")
    class BaseFileUploadsController {
        constructor(private readonly fileUploadsService: FileUploadsService, private readonly entityManager: EntityManager) {}

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
