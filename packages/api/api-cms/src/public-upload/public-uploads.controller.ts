import { EntityManager } from "@mikro-orm/core";
import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import rimraf from "rimraf";

import { PublicApi } from "../auth/decorators/public-api.decorator";
import { PublicUploadFileUploadInterface } from "./dto/public-upload-file-upload.interface";
import { PublicUpload } from "./entities/public-upload.entity";
import { PublicUploadFileInterceptor } from "./public-upload-file.interceptor";
import { PublicUploadsService } from "./public-uploads.service";

type AcceptedMimeTypes = {
    PIXEL_IMAGE: string[];
    SVG_IMAGE: string[];
    VIDEO: string[];
    AUDIO: string[];
    OTHER: string[];
};

export const acceptedMimeTypesByCategory: AcceptedMimeTypes = {
    SVG_IMAGE: ["image/svg+xml"],
    PIXEL_IMAGE: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/tiff", "image/psd", "image/vnd.microsoft.icon", "image/bmp"],
    AUDIO: ["audio/mpeg", "audio/mp3", "audio/ogg", "audio/wav"],
    VIDEO: ["video/mp4", "video/quicktime", "video/ogg", "video/avi", "video/x-m4v", "video/webm"],
    OTHER: [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "application/vnd.oasis.opendocument.text",
        "text/csv",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "application/vnd.oasis.opendocument.spreadsheet",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.ms-powerpoint",
        "application/vnd.oasis.opendocument.presentation",
        "application/x-zip-compressed",
        "application/zip",
    ],
};

@Controller("public-upload/files")
@PublicApi()
export class PublicUploadsController {
    constructor(private readonly publicUploadsService: PublicUploadsService, private readonly entityManager: EntityManager) {}

    @Post("upload")
    @UseInterceptors(PublicUploadFileInterceptor("file"))
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
