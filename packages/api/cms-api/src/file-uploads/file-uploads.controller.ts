import { EntityManager } from "@mikro-orm/postgresql";
import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import rimraf from "rimraf";

import { DisableCometGuards } from "../auth/decorators/disable-comet-guards.decorator";
import { FileUploadInput } from "../dam/files/dto/file-upload.input";
import { FileUpload } from "./entities/file-upload.entity";
import { FileUploadsService } from "./file-uploads.service";
import { FileUploadsFileInterceptor } from "./file-uploads-file.interceptor";

@Controller("file-uploads")
export class FileUploadsController {
    constructor(private readonly fileUploadsService: FileUploadsService, private readonly entityManager: EntityManager) {}

    @Post("upload")
    @UseInterceptors(FileUploadsFileInterceptor("file"))
    @DisableCometGuards()
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
