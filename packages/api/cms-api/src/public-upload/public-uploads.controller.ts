import { EntityManager } from "@mikro-orm/postgresql";
import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import rimraf from "rimraf";

import { PublicApi } from "../auth/decorators/public-api.decorator";
import { FileSanitizationInterceptor } from "../dam/files/file-sanitization.interceptor";
import { PublicUploadFileUploadInterface } from "./dto/public-upload-file-upload.interface";
import { PublicUpload } from "./entities/public-upload.entity";
import { PublicUploadFileInterceptor } from "./public-upload-file.interceptor";
import { PublicUploadsService } from "./public-uploads.service";

@Controller("public-upload/files")
@PublicApi()
export class PublicUploadsController {
    constructor(private readonly publicUploadsService: PublicUploadsService, private readonly entityManager: EntityManager) {}

    @Post("upload")
    @UseInterceptors(PublicUploadFileInterceptor("file"), FileSanitizationInterceptor)
    @PublicApi()
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
}
