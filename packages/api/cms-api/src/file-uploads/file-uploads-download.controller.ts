import { mediaType } from "@hapi/accept";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Controller, Get, GoneException, Headers, Inject, NotFoundException, Param, Res, Type, UnsupportedMediaTypeException } from "@nestjs/common";
import { Response } from "express";
import mime from "mime";
import fetch from "node-fetch";
import { PassThrough } from "stream";

import { DisableCometGuards } from "../auth/decorators/disable-comet-guards.decorator";
import { BlobStorageBackendService } from "../blob-storage/backends/blob-storage-backend.service";
import { ScaledImagesCacheService } from "../dam/cache/scaled-images-cache.service";
import { calculatePartialRanges, createHashedPath } from "../dam/files/files.utils";
import { Extension, ResizingType } from "../dam/imgproxy/imgproxy.enum";
import { ImgproxyService } from "../dam/imgproxy/imgproxy.service";
import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { DownloadParams, HashDownloadParams, PreviewParams } from "./dto/file-uploads-download.params";
import { FileUpload } from "./entities/file-upload.entity";
import { FileUploadsConfig } from "./file-uploads.config";
import { FILE_UPLOADS_CONFIG } from "./file-uploads.constants";
import { FileUploadsService } from "./file-uploads.service";

const WEBP = "image/webp";
const PNG = "image/png";
const JPEG = "image/jpeg";
const GIF = "image/gif";
const BASIC_TYPES = [JPEG, PNG, GIF];
const MODERN_TYPES = [/* AVIF, */ WEBP];

function getSupportedMimeType(options: string[], accept = ""): string {
    const mimeType = mediaType(accept, options);
    return accept.includes(mimeType) ? mimeType : "";
}

export function createFileUploadsDownloadController(options: { public: boolean }): Type<unknown> {
    @Controller("file-uploads")
    class BaseFileUploadsDownloadController {
        constructor(
            @InjectRepository(FileUpload) private readonly fileUploadsRepository: EntityRepository<FileUpload>,
            @Inject(BlobStorageBackendService) private readonly blobStorageBackendService: BlobStorageBackendService,
            @Inject(FILE_UPLOADS_CONFIG) private readonly config: FileUploadsConfig,
            private readonly fileUploadsService: FileUploadsService,
            private readonly cacheService: ScaledImagesCacheService,
            private readonly imgproxyService: ImgproxyService,
        ) {}

        @Get(":hash/:id/:timeout")
        async download(@Param() { hash, ...params }: HashDownloadParams, @Res() res: Response, @Headers("range") range?: string): Promise<void> {
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

            const headers = {
                "content-disposition": `attachment; filename="${file.name}"`,
                "content-type": file.mimetype,
                "last-modified": file.updatedAt?.toUTCString(),
                "content-length": file.size,
            };

            // https://medium.com/@vishal1909/how-to-handle-partial-content-in-node-js-8b0a5aea216
            let stream: NodeJS.ReadableStream;

            if (range) {
                const { start, end, contentLength } = calculatePartialRanges(file.size, range);

                if (start >= file.size || end >= file.size) {
                    res.writeHead(416, {
                        "content-range": `bytes */${file.size}`,
                    });
                    res.end();
                    return;
                }

                stream = await this.blobStorageBackendService.getPartialFile(
                    this.config.directory,
                    createHashedPath(file.contentHash),
                    start,
                    contentLength,
                );

                res.writeHead(206, {
                    ...headers,
                    "accept-ranges": "bytes",
                    "content-range": `bytes ${start}-${end}/${file.size}`,
                    "content-length": contentLength,
                });
            } else {
                stream = await this.blobStorageBackendService.getFile(this.config.directory, createHashedPath(file.contentHash));

                res.writeHead(200, headers);
            }

            stream.pipe(res);
        }

        @Get(":hash/:id/:timeout/:resizeWidth")
        async preview(
            @Param() { hash, resizeWidth, ...params }: PreviewParams,
            @Res() res: Response,
            @Headers("Accept") accept: string,
        ): Promise<void> {
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

            if (!["image/webp", "image/png", "image/jpeg", "image/gif"].includes(file.mimetype)) {
                throw new UnsupportedMediaTypeException();
            }

            const filePath = createHashedPath(file.contentHash);
            const fileExists = await this.blobStorageBackendService.fileExists(this.config.directory, filePath);

            if (!fileExists) {
                throw new NotFoundException();
            }

            const path = this.imgproxyService
                .builder()
                .resize(ResizingType.AUTO, resizeWidth)
                .format(
                    (mime.getExtension(
                        getSupportedMimeType(MODERN_TYPES, accept) || getSupportedMimeType(BASIC_TYPES, file.mimetype),
                    ) as Extension) || Extension.JPG,
                )
                .generateUrl(`${this.blobStorageBackendService.getBackendFilePathPrefix()}${this.config.directory}/${filePath}`);

            const cache = await this.cacheService.get(file.contentHash, path);
            if (!cache) {
                const response = await fetch(this.imgproxyService.getSignedUrl(path));
                const headers: Record<string, string> = {};
                for (const [key, value] of response.headers.entries()) {
                    headers[key] = value;
                }

                res.writeHead(response.status, headers);
                response.body.pipe(new PassThrough()).pipe(res);

                if (response.ok) {
                    await this.cacheService.set(file.contentHash, path, {
                        file: response.body.pipe(new PassThrough()),
                        metaData: {
                            size: Number(headers["content-length"]),
                            headers,
                        },
                    });
                }
            } else {
                res.writeHead(200, cache.metaData.headers);

                cache.file.pipe(res);
            }
        }

        private isValidHash(hash: string, params: DownloadParams): boolean {
            return hash === this.fileUploadsService.createHash(params);
        }
    }

    if (options.public) {
        @DisableCometGuards()
        class PublicFileUploadsDownloadController extends BaseFileUploadsDownloadController {}

        return PublicFileUploadsDownloadController;
    }

    @RequiredPermission("fileUploads", { skipScopeCheck: true })
    class PrivateFileUploadsDownloadController extends BaseFileUploadsDownloadController {}

    return PrivateFileUploadsDownloadController;
}