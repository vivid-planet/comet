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
import { Response } from "express";
import { OutgoingHttpHeaders } from "http";

import { DisableGlobalGuard } from "../../auth/decorators/global-guard-disable.decorator";
import { BlobStorageBackendService } from "../../blob-storage/backends/blob-storage-backend.service";
import { CDN_ORIGIN_CHECK_HEADER, DamConfig } from "../dam.config";
import { DAM_CONFIG } from "../dam.constants";
import { DamUploadFileInterceptor } from "./dam-upload-file.interceptor";
import { UploadFileBody } from "./dto/file.body";
import { FileParams, HashFileParams } from "./dto/file.params";
import { FileUploadInterface } from "./dto/file-upload.interface";
import { File } from "./entities/file.entity";
import { FileSanitizationInterceptor } from "./file-sanitization.interceptor";
import { FilesService } from "./files.service";
import { calculatePartialRanges, createHashedPath } from "./files.utils";

const fileUrl = `:fileId/:filename`;

@Controller("dam/files")
export class FilesController {
    constructor(
        @Inject(DAM_CONFIG) private readonly damConfig: DamConfig,
        private readonly filesService: FilesService,
        private readonly blobStorageBackendService: BlobStorageBackendService,
    ) {}

    @Post("upload")
    @UseInterceptors(DamUploadFileInterceptor(FilesService.UPLOAD_FIELD), FileSanitizationInterceptor)
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
        if (this.damConfig.cdnEnabled && !this.damConfig.disableCdnOriginHeaderCheck) {
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
