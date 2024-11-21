import { BaseEntity } from "@mikro-orm/core";
import {
    BadRequestException,
    Body,
    Controller,
    ForbiddenException,
    Get,
    Headers,
    Inject,
    Logger,
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
import { Readable } from "stream";

import { DisableCometGuards } from "../../auth/decorators/disable-comet-guards.decorator";
import { GetCurrentUser } from "../../auth/decorators/get-current-user.decorator";
import { BlobStorageBackendService } from "../../blob-storage/backends/blob-storage-backend.service";
import { createHashedPath } from "../../blob-storage/utils/create-hashed-path.util";
import { CometValidationException } from "../../common/errors/validation.exception";
import { ContentScopeService } from "../../user-permissions/content-scope.service";
import { RequiredPermission } from "../../user-permissions/decorators/required-permission.decorator";
import { CurrentUser } from "../../user-permissions/dto/current-user";
import { ACCESS_CONTROL_SERVICE } from "../../user-permissions/user-permissions.constants";
import { AccessControlServiceInterface } from "../../user-permissions/user-permissions.types";
import { DamConfig } from "../dam.config";
import { DAM_CONFIG } from "../dam.constants";
import { DamScopeInterface } from "../types";
import { DamUploadFileInterceptor } from "./dam-upload-file.interceptor";
import { EmptyDamScope } from "./dto/empty-dam-scope";
import { createReplaceFileByIdBody, createUploadFileBody, ReplaceFileByIdBodyInterface, UploadFileBodyInterface } from "./dto/file.body";
import { FileParams, HashFileParams } from "./dto/file.params";
import { FileUploadInput } from "./dto/file-upload.input";
import { FileInterface } from "./entities/file.entity";
import { FilesService } from "./files.service";
import { calculatePartialRanges } from "./files.utils";
import { FoldersService } from "./folders.service";

const fileUrl = `:fileId/:filename`;

export function createFilesController({ Scope: PassedScope }: { Scope?: Type<DamScopeInterface> }): Type<unknown> {
    const Scope = PassedScope ?? EmptyDamScope;
    const hasNonEmptyScope = PassedScope != null;

    function nonEmptyScopeOrNothing(scope: DamScopeInterface): DamScopeInterface | undefined {
        return hasNonEmptyScope ? scope : undefined;
    }

    const UploadFileBody = createUploadFileBody({ Scope });
    const ReplaceFileByIdBody = createReplaceFileByIdBody({ Scope });

    @Controller("dam/files")
    @RequiredPermission(["dam"], { skipScopeCheck: true }) // Scope is checked in actions
    class FilesController {
        private readonly logger = new Logger(FilesController.name);
        constructor(
            @Inject(DAM_CONFIG) private readonly damConfig: DamConfig,
            private readonly filesService: FilesService,
            private readonly blobStorageBackendService: BlobStorageBackendService,
            @Inject(ACCESS_CONTROL_SERVICE) private accessControlService: AccessControlServiceInterface,
            private readonly contentScopeService: ContentScopeService,
            private readonly foldersService: FoldersService,
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

            const folderId = transformedBody.folderId;
            if (folderId) {
                const folder = await this.foldersService.findOneById(folderId);
                if (!folder) throw new BadRequestException(`Folder ${folderId} not found`);
                if (!this.contentScopeService.scopesAreEqual(folder.scope, scope)) {
                    throw new BadRequestException("Folder scope doesn't match passed scope");
                }
            }

            const uploadedFile = await this.filesService.upload(file, { ...transformedBody, folderId, scope });
            const fileUrl = await this.filesService.createFileUrl(uploadedFile, {
                previewDamUrls: Boolean(previewDamUrls),
                relativeDamUrls: Boolean(relativeDamUrls),
            });

            return { ...uploadedFile, fileUrl };
        }

        @Post("replace-by-filename-and-folder")
        @UseInterceptors(DamUploadFileInterceptor(FilesService.UPLOAD_FIELD))
        async replaceByFilenameAndFolder(
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

            const folderId = transformedBody.folderId;
            if (folderId) {
                const folder = await this.foldersService.findOneById(folderId);
                if (!folder) throw new BadRequestException(`Folder ${folderId} not found`);
                if (!this.contentScopeService.scopesAreEqual(folder.scope, scope)) {
                    throw new BadRequestException("Folder scope doesn't match passed scope");
                }
            }

            const fileToReplace = await this.filesService.findOneByFilenameAndFolder({ filename: file.originalname, folderId });
            if (!fileToReplace) {
                throw new NotFoundException(`File not found`);
            }
            if (!this.accessControlService.isAllowed(user, "dam", fileToReplace.scope)) {
                throw new ForbiddenException();
            }

            const replacedFile = await this.filesService.replace(fileToReplace, file, transformedBody);

            const fileUrl = await this.filesService.createFileUrl(replacedFile, {
                previewDamUrls: Boolean(previewDamUrls),
                relativeDamUrls: Boolean(relativeDamUrls),
            });

            return { ...replacedFile, fileUrl };
        }

        @Post("replace-by-id")
        @UseInterceptors(DamUploadFileInterceptor(FilesService.UPLOAD_FIELD))
        async replaceById(
            @UploadedFile() file: FileUploadInput,
            @Body() body: ReplaceFileByIdBodyInterface,
            @GetCurrentUser() user: CurrentUser,
            @Headers("x-preview-dam-urls") previewDamUrls: string | undefined,
            @Headers("x-relative-dam-urls") relativeDamUrls: string | undefined,
        ): Promise<Omit<FileInterface, keyof BaseEntity<FileInterface, "id">> & { fileUrl: string }> {
            const { fileId, ...transformedBody } = plainToInstance(ReplaceFileByIdBody, body);
            const errors = await validate(transformedBody, { whitelist: true, forbidNonWhitelisted: true });

            if (errors.length > 0) {
                throw new CometValidationException("Validation failed", errors);
            }

            const fileToReplace = await this.filesService.findOneById(fileId);
            if (!fileToReplace) {
                throw new NotFoundException(`File ${fileId} not found`);
            }
            if (!this.accessControlService.isAllowed(user, "dam", fileToReplace.scope)) {
                throw new ForbiddenException();
            }

            const replacedFile = await this.filesService.replace(fileToReplace, file, transformedBody);

            const fileUrl = await this.filesService.createFileUrl(replacedFile, {
                previewDamUrls: Boolean(previewDamUrls),
                relativeDamUrls: Boolean(relativeDamUrls),
            });

            return { ...replacedFile, fileUrl };
        }

        @Get(`/preview/:contentHash?/${fileUrl}`)
        async previewFileUrl(
            @Param() { fileId, contentHash }: FileParams,
            @Res() res: Response,
            @GetCurrentUser() user: CurrentUser,
            @Headers("range") range?: string,
        ): Promise<void> {
            const file = await this.filesService.findOneById(fileId);

            if (file === null) {
                throw new NotFoundException();
            }

            if (contentHash && file.contentHash !== contentHash) {
                throw new BadRequestException("Content Hash mismatch!");
            }

            if (file.scope !== undefined && !this.accessControlService.isAllowed(user, "dam", file.scope)) {
                throw new ForbiddenException();
            }

            return this.streamFile(file, res, { range, overrideHeaders: { "cache-control": "max-age=31536000, private" } }); // Local caches only (1 year)
        }

        @Get(`/download/preview/:contentHash?/${fileUrl}`)
        async previewDownloadFile(
            @Param() { fileId, contentHash }: FileParams,
            @Res() res: Response,
            @GetCurrentUser() user: CurrentUser,
            @Headers("range") range?: string,
        ): Promise<void> {
            const file = await this.filesService.findOneById(fileId);

            if (file === null) {
                throw new NotFoundException();
            }

            if (contentHash && file.contentHash !== contentHash) {
                throw new BadRequestException("Content Hash mismatch!");
            }

            if (file.scope !== undefined && !this.accessControlService.isAllowed(user, "dam", file.scope)) {
                throw new ForbiddenException();
            }

            res.setHeader("Content-Disposition", "attachment");
            return this.streamFile(file, res, { range, overrideHeaders: { "cache-control": "max-age=31536000, private" } }); // Local caches only (1 year)
        }

        @DisableCometGuards()
        @Get(`/download/:hash/:contentHash?/${fileUrl}`)
        async downloadFile(
            @Param() { hash, contentHash, ...params }: HashFileParams,
            @Res() res: Response,
            @Headers("range") range?: string,
        ): Promise<void> {
            if (!this.isValidHash(hash, params)) {
                throw new BadRequestException("Invalid hash");
            }

            const file = await this.filesService.findOneById(params.fileId);

            if (file === null) {
                throw new NotFoundException();
            }

            if (contentHash && file.contentHash !== contentHash) {
                throw new BadRequestException("Content Hash mismatch!");
            }

            res.setHeader("Content-Disposition", "attachment");
            return this.streamFile(file, res, { range, overrideHeaders: { "cache-control": "max-age=86400, public" } }); // Public cache (1 day)
        }

        @DisableCometGuards()
        @Get(`/:hash/:contentHash?/${fileUrl}`)
        async hashedFileUrl(
            @Param() { hash, contentHash, ...params }: HashFileParams,
            @Res() res: Response,
            @Headers("range") range?: string,
        ): Promise<void> {
            if (!this.isValidHash(hash, params)) {
                throw new BadRequestException("Invalid hash");
            }

            const file = await this.filesService.findOneById(params.fileId);

            if (file === null) {
                throw new NotFoundException();
            }

            if (contentHash && file.contentHash !== contentHash) {
                throw new BadRequestException("Content Hash mismatch!");
            }

            return this.streamFile(file, res, { range, overrideHeaders: { "cache-control": "max-age=86400, public" } }); // Public cache (1 day)
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
            let stream: Readable;
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
                    stream = await this.blobStorageBackendService.getPartialFile(
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
                    stream = await this.blobStorageBackendService.getFile(this.damConfig.filesDirectory, createHashedPath(file.contentHash));
                } catch (err) {
                    throw new Error(`File-Stream error: (storage.getFile) - ${(err as Error).message}`);
                }

                stream.on("error", (error) => {
                    this.logger.error("Stream error:", error);
                    res.end();
                });

                res.on("close", () => {
                    stream.destroy();
                });

                res.writeHead(200, {
                    ...headers,
                    ...options?.overrideHeaders,
                });
            }

            stream.pipe(res);
        }
    }

    return FilesController;
}
