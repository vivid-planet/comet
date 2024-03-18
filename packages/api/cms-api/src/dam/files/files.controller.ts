import { BaseEntity } from "@mikro-orm/core";
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
    Type,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Response } from "express";
import { OutgoingHttpHeaders } from "http";

import { GetCurrentUser } from "../../auth/decorators/get-current-user.decorator";
import { DisableGlobalGuard } from "../../auth/decorators/global-guard-disable.decorator";
import { BlobStorageBackendService } from "../../blob-storage/backends/blob-storage-backend.service";
import { CometValidationException } from "../../common/errors/validation.exception";
import { RequiredPermission } from "../../user-permissions/decorators/required-permission.decorator";
import { CurrentUser } from "../../user-permissions/dto/current-user";
import { ACCESS_CONTROL_SERVICE } from "../../user-permissions/user-permissions.constants";
import { AccessControlServiceInterface } from "../../user-permissions/user-permissions.types";
import { DamConfig } from "../dam.config";
import { DAM_CONFIG } from "../dam.constants";
import { DamScopeInterface } from "../types";
import { DamUploadFileInterceptor } from "./dam-upload-file.interceptor";
import { EmptyDamScope } from "./dto/empty-dam-scope";
import { createUploadFileBody, UploadFileBodyInterface } from "./dto/file.body";
import { FileParams, HashFileParams } from "./dto/file.params";
import { FileUploadInput } from "./dto/file-upload.input";
import { FileInterface } from "./entities/file.entity";
import { FilesService } from "./files.service";
import { calculatePartialRanges, createHashedPath } from "./files.utils";

const fileUrl = `:fileId/:filename`;

export function createFilesController({ Scope: PassedScope }: { Scope?: Type<DamScopeInterface> }): Type<unknown> {
    const Scope = PassedScope ?? EmptyDamScope;
    const hasNonEmptyScope = PassedScope != null;

    function nonEmptyScopeOrNothing(scope: DamScopeInterface): DamScopeInterface | undefined {
        return hasNonEmptyScope ? scope : undefined;
    }

    const UploadFileBody = createUploadFileBody({ Scope });

    @Controller("dam/files")
    @RequiredPermission(["dam"], { skipScopeCheck: true }) // Scope is checked in actions
    class FilesController {
        constructor(
            @Inject(DAM_CONFIG) private readonly damConfig: DamConfig,
            private readonly filesService: FilesService,
            private readonly blobStorageBackendService: BlobStorageBackendService,
            @Inject(ACCESS_CONTROL_SERVICE) private accessControlService: AccessControlServiceInterface,
        ) {}

        @Post("upload")
        @UseInterceptors(DamUploadFileInterceptor(FilesService.UPLOAD_FIELD))
        async upload(
            @UploadedFile() file: FileUploadInput,
            @Body() body: UploadFileBodyInterface,
            @GetCurrentUser() user: CurrentUser,
            @Headers("x-preview-dam-urls") previewDamUrls: string | undefined,
            @Headers("x-relative-dam-urls") relativeDamUrls: string | undefined,
        ): Promise<Omit<FileInterface, keyof BaseEntity<FileInterface, "id">> & { fileUrl: string }> {
            const transformedBody = plainToInstance(UploadFileBody, body);
            const errors = await validate(transformedBody, { whitelist: true, forbidNonWhitelisted: true });

            if (errors.length > 0) {
                throw new CometValidationException("Validation failed", errors);
            }
            const scope = nonEmptyScopeOrNothing(transformedBody.scope);

            if (scope && !this.accessControlService.isAllowed(user, "dam", scope)) {
                throw new ForbiddenException();
            }

            const uploadedFile = await this.filesService.upload(file, { ...transformedBody, scope });
            const fileUrl = await this.filesService.createFileUrl(uploadedFile, {
                previewDamUrls: Boolean(previewDamUrls),
                relativeDamUrls: Boolean(relativeDamUrls),
            });

            return { ...uploadedFile, fileUrl };
        }

        @Get(`/preview/${fileUrl}`)
        async previewFileUrl(
            @Param() { fileId }: FileParams,
            @Res() res: Response,
            @GetCurrentUser() user: CurrentUser,
            @Headers("range") range?: string,
        ): Promise<void> {
            const file = await this.filesService.findOneById(fileId);

            if (file === null) {
                throw new NotFoundException();
            }

            if (file.scope !== undefined && !this.accessControlService.isAllowed(user, "dam", file.scope)) {
                throw new ForbiddenException();
            }

            return this.streamFile(file, res, { range, overrideHeaders: { "Cache-control": "private" } });
        }

        @DisableGlobalGuard()
        @Get(`/:hash/${fileUrl}`)
        async hashedFileUrl(@Param() { hash, ...params }: HashFileParams, @Res() res: Response, @Headers("range") range?: string): Promise<void> {
            if (!this.isValidHash(hash, params)) {
                throw new NotFoundException();
            }

            const file = await this.filesService.findOneById(params.fileId);

            if (file === null) {
                throw new NotFoundException();
            }

            return this.streamFile(file, res, { range });
        }

        private isValidHash(hash: string, fileParams: FileParams): boolean {
            return hash === this.filesService.createHash(fileParams);
        }

        private async streamFile(
            file: FileInterface,
            res: Response,
            options?: {
                range?: string;
                overrideHeaders?: OutgoingHttpHeaders;
            },
        ): Promise<void> {
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

    return FilesController;
}
