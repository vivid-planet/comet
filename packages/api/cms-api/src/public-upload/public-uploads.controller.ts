import { EntityManager } from "@mikro-orm/postgresql";
import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import rimraf from "rimraf";

import { DisableCometGuards } from "../auth/decorators/disable-comet-guards.decorator";
import { PublicUploadFileUploadInterface } from "./dto/public-upload-file-upload.interface";
import { PublicUpload } from "./entities/public-upload.entity";
import { PublicUploadFileInterceptor } from "./public-upload-file.interceptor";
import { PublicUploadsService } from "./public-uploads.service";

@Controller("public-upload/files")
export class PublicUploadsController {
    constructor(private readonly publicUploadsService: PublicUploadsService, private readonly entityManager: EntityManager) {}

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
    @DisableCometGuards()
    async downloadFileById(@Param("id") id: string, @Res() res: NodeJS.WritableStream): Promise<void> {
        const stream = await this.publicUploadsService.getFileStreamById(id);
        stream.pipe(res);
    }
}
