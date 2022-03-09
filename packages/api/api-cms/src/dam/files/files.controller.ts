import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    Headers,
    Inject,
    NotFoundException,
    Param,
    Post,
    Res,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import * as fs from "fs";
import { OutgoingHttpHeaders } from "http";
import * as mimedb from "mime-db";
import * as multer from "multer";
import * as os from "os";
import { v4 as uuidv4 } from "uuid";

import { DisableGlobalGuard } from "../../auth/decorators/global-guard-disable.decorator";
import { BlobStorageBackendService } from "../../blob-storage/backends/blob-storage-backend.service";
import { CometValidationException } from "../../common/errors/validation.exception";
import { CDN_ORIGIN_CHECK_HEADER, DamConfig } from "../dam.config";
import { DAM_CONFIG } from "../dam.constants";
import { UploadFileBody } from "./dto/file.body";
import { FileParams, HashFileParams } from "./dto/file.params";
import { FileCategory } from "./dto/file-type.enum";
import { FileUploadInterface } from "./dto/file-upload.interface";
import { File } from "./entities/file.entity";
import { FilesService } from "./files.service";
import { calculatePartialRanges, createHashedPath } from "./files.utils";

type AcceptedMimeTypes = {
    [key in FileCategory]: string[];
};

// this mimetype list is duplicated in admin/admin-cms/src/dam/Table/fileUpload/acceptedMimetypes.tsx
// if you change this file, change the admin file too
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

const fileUrl = `:fileId/:filename`;

@Controller("dam/files")
export class FilesController {
    constructor(
        @Inject(DAM_CONFIG) private readonly damConfig: DamConfig,
        private readonly filesService: FilesService,
        private readonly blobStorageBackendService: BlobStorageBackendService,
    ) {
        if (damConfig.additionalMimetypes) {
            const existingMimetypes = Object.values(acceptedMimeTypesByCategory).reduce((prev, mimetypes) => {
                return [...prev, ...mimetypes];
            }, []);

            for (const additonalMimetype of damConfig.additionalMimetypes.split(",")) {
                if (!existingMimetypes.includes(additonalMimetype)) {
                    acceptedMimeTypesByCategory.OTHER.push(additonalMimetype);
                }
            }
        }
    }

    @Post("upload")
    @UseInterceptors(
        FileInterceptor(FilesService.UPLOAD_FIELD, {
            storage: multer.diskStorage({
                destination: function (req, file, cb) {
                    const destination = `${os.tmpdir()}/uploads`;
                    fs.access(destination, (err) => {
                        if (err) {
                            fs.mkdir(destination, () => {
                                cb(null, destination);
                            });
                        } else {
                            cb(null, destination);
                        }
                    });
                },
                filename: function (req, file, cb) {
                    cb(null, `${uuidv4()}-${file.originalname}`);
                },
            }),
            limits: {
                fileSize: Number(process.env.DAM_UPLOADS_MAX_FILE_SIZE) * 1024 * 1024,
            },
            fileFilter: (req, file, cb) => {
                if (Object.values(acceptedMimeTypesByCategory).every((mimetypes) => !mimetypes.includes(file.mimetype))) {
                    return cb(new CometValidationException(`Unsupported mime type: ${file.mimetype}`), false);
                }

                const extension = file.originalname.split(".").pop();
                if (extension === undefined) {
                    return cb(new CometValidationException(`Invalid file name: Missing file extension`), false);
                }

                const supportedExtensions = mimedb[file.mimetype].extensions;
                if (supportedExtensions === undefined || !supportedExtensions.includes(extension)) {
                    return cb(
                        new CometValidationException(`File type and extension mismatch: .${extension} and ${file.mimetype} are incompatible`),
                        false,
                    );
                }

                return cb(null, true);
            },
        }),
    ) // The interceptor is configured in ./multer-config.service.ts
    async upload(@UploadedFile() file: FileUploadInterface, @Body() { folderId }: UploadFileBody): Promise<File> {
        const uploadedFile = await this.filesService.upload(file, folderId);
        return Object.assign(uploadedFile, { fileUrl: await this.filesService.createFileUrl(uploadedFile) });
    }

    @Get(`/preview/${fileUrl}`)
    async previewFileUrl(@Param() params: FileParams, @Res() res: Response, @Headers("range") range?: string): Promise<void> {
        return this.streamFile(params, res, { range, overrideHeaders: { "Cache-control": "private" } });
    }

    @DisableGlobalGuard()
    @Get(`/:hash/${fileUrl}`)
    async hashedFileUrl(
        @Param() { hash, ...params }: HashFileParams,
        @Res() res: Response,
        @Headers(CDN_ORIGIN_CHECK_HEADER) cdnOriginCheck: string,
        @Headers("range") range?: string,
    ): Promise<void> {
        this.checkCdnOrigin(cdnOriginCheck);

        if (!this.isValidHash(hash, params)) {
            throw new NotFoundException();
        }

        return this.streamFile(params, res, { range });
    }

    private checkCdnOrigin(incomingCdnOriginHeader: string): void {
        if (this.damConfig.cdnEnabled) {
            if (incomingCdnOriginHeader !== this.damConfig.cdnOriginHeader) {
                throw new ForbiddenException();
            }
        }
    }

    private isValidHash(hash: string, fileParams: FileParams): boolean {
        return hash === this.filesService.createHash(fileParams);
    }

    private async streamFile(
        { fileId }: FileParams,
        res: Response,
        options?: {
            range?: string;
            overrideHeaders?: OutgoingHttpHeaders;
        },
    ): Promise<void> {
        const file = await this.filesService.findOneById(fileId);
        if (!file) throw new NotFoundException();

        const headers = {
            "content-type": file.mimetype,
            "last-modified": file.updatedAt?.toUTCString(),
            "content-length": file.size,
        };

        // https://medium.com/@vishal1909/how-to-handle-partial-content-in-node-js-8b0a5aea216
        let response: NodeJS.ReadableStream;
        if (options?.range) {
            const { start, end, contentLength } = calculatePartialRanges(file.size, options.range);

            if (start >= file.size || end >= file.size) {
                res.writeHead(416, {
                    "content-range": `bytes */${file.size}`,
                });
                res.end();
                return;
            }

            try {
                response = await this.blobStorageBackendService.getPartialFile(
                    this.damConfig.filesDirectory,
                    createHashedPath(file.contentHash),
                    start,
                    contentLength,
                );
            } catch (err) {
                throw new Error(`File-Stream error: (storage.getPartialFile) - ${(err as Error).message}`);
            }

            res.writeHead(206, {
                ...headers,
                ...options?.overrideHeaders,
                "accept-ranges": "bytes",
                "content-range": `bytes ${start}-${end}/${file.size}`,
                "content-length": contentLength,
            });
        } else {
            try {
                response = await this.blobStorageBackendService.getFile(this.damConfig.filesDirectory, createHashedPath(file.contentHash));
            } catch (err) {
                throw new Error(`File-Stream error: (storage.getFile) - ${(err as Error).message}`);
            }

            res.writeHead(200, {
                ...headers,
                ...options?.overrideHeaders,
            });
        }

        response.pipe(res);
    }
}
