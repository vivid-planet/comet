import { BadRequestException, Controller, ForbiddenException, forwardRef, Get, Headers, Inject, NotFoundException, Param, Res } from "@nestjs/common";
import { Response } from "express";
import { OutgoingHttpHeaders } from "http";
import mime from "mime";
import fetch from "node-fetch";
import { PassThrough } from "stream";

import { DisableCometGuards } from "../../auth/decorators/disable-comet-guards.decorator";
import { GetCurrentUser } from "../../auth/decorators/get-current-user.decorator";
import { BlobStorageBackendService } from "../../blob-storage/backends/blob-storage-backend.service";
import { createHashedPath } from "../../blob-storage/utils/create-hashed-path.util";
import { RequiredPermission } from "../../user-permissions/decorators/required-permission.decorator";
import { CurrentUser } from "../../user-permissions/dto/current-user";
import { ACCESS_CONTROL_SERVICE } from "../../user-permissions/user-permissions.constants";
import { AccessControlServiceInterface } from "../../user-permissions/user-permissions.types";
import { ScaledImagesCacheService } from "../cache/scaled-images-cache.service";
import { FocalPoint } from "../common/enums/focal-point.enum";
import { DamConfig } from "../dam.config";
import { DAM_CONFIG } from "../dam.constants";
import { FileInterface } from "../files/entities/file.entity";
import { FilesService } from "../files/files.service";
import { Extension, Gravity, ResizingType } from "../imgproxy/imgproxy.enum";
import { ImgproxyService } from "../imgproxy/imgproxy.service";
import { HashImageParams, ImageParams } from "./dto/image.params";
import { BASIC_TYPES, MODERN_TYPES } from "./images.constants";
import { ImagesService } from "./images.service";
import { getCenteredPosition, getMaxDimensionsFromArea, getSupportedMimeType } from "./images.util";

const smartImageUrl = `:fileId/crop::focalPoint([A-Z]{5,9})/resize::resizeWidth::resizeHeight/:filename`;
const focusImageUrl = `:fileId/crop::cropWidth::cropHeight::focalPoint::cropX::cropY/resize::resizeWidth::resizeHeight/:filename`;

@Controller("dam/images")
@RequiredPermission(["dam"], { skipScopeCheck: true }) // Scopes are checked in Code
export class ImagesController {
    constructor(
        @Inject(DAM_CONFIG) private readonly config: DamConfig,
        private readonly imgproxyService: ImgproxyService,
        @Inject(forwardRef(() => FilesService)) private readonly filesService: FilesService,
        private readonly imagesService: ImagesService,
        private readonly cacheService: ScaledImagesCacheService,
        @Inject(forwardRef(() => BlobStorageBackendService)) private readonly blobStorageBackendService: BlobStorageBackendService,
        @Inject(ACCESS_CONTROL_SERVICE) private accessControlService: AccessControlServiceInterface,
    ) {}

    @Get(`/preview/:contentHash?/${smartImageUrl}`)
    async previewSmartCroppedImage(
        @Param() params: ImageParams,
        @Headers("Accept") accept: string,
        @Res() res: Response,
        @GetCurrentUser() user: CurrentUser,
    ): Promise<void> {
        if (params.cropArea.focalPoint !== FocalPoint.SMART) {
            throw new NotFoundException();
        }

        const file = await this.filesService.findOneById(params.fileId);

        if (file === null) {
            throw new NotFoundException();
        }

        if (params.contentHash && file.contentHash !== params.contentHash) {
            throw new BadRequestException("Content Hash mismatch!");
        }

        if (file.scope !== undefined && !this.accessControlService.isAllowed(user, "dam", file.scope)) {
            throw new ForbiddenException();
        }

        return this.getCroppedImage(file, params, accept, res, {
            "cache-control": "max-age=31536000, private", // Local caches only (1 year)
        });
    }

    @Get(`/preview/:contentHash?/${focusImageUrl}`)
    async previewFocusCroppedImage(
        @Param() params: ImageParams,
        @Headers("Accept") accept: string,
        @Res() res: Response,
        @GetCurrentUser() user: CurrentUser,
    ): Promise<void> {
        if (params.cropArea.focalPoint === FocalPoint.SMART) {
            throw new NotFoundException();
        }

        const file = await this.filesService.findOneById(params.fileId);

        if (file === null) {
            throw new NotFoundException();
        }

        if (params.contentHash && file.contentHash !== params.contentHash) {
            throw new BadRequestException("Content Hash mismatch!");
        }

        if (file.scope !== undefined && !this.accessControlService.isAllowed(user, "dam", file.scope)) {
            throw new ForbiddenException();
        }

        return this.getCroppedImage(file, params, accept, res, {
            "cache-control": "max-age=31536000, private", // Local caches only (1 year)
        });
    }

    @DisableCometGuards()
    @Get(`/:hash/:contentHash?/${smartImageUrl}`)
    async smartCroppedImage(@Param() params: HashImageParams, @Headers("Accept") accept: string, @Res() res: Response): Promise<void> {
        if (!this.isValidHash(params) || params.cropArea.focalPoint !== FocalPoint.SMART) {
            throw new BadRequestException("Invalid hash");
        }

        const file = await this.filesService.findOneById(params.fileId);

        if (file === null) {
            throw new NotFoundException();
        }

        if (params.contentHash && file.contentHash !== params.contentHash) {
            throw new BadRequestException("Content Hash mismatch!");
        }

        return this.getCroppedImage(file, params, accept, res, {
            "cache-control": "max-age=86400, public", // Public cache (1 day)
        });
    }

    @DisableCometGuards()
    @Get(`/:hash/:contentHash?/${focusImageUrl}`)
    async focusCroppedImage(@Param() params: HashImageParams, @Headers("Accept") accept: string, @Res() res: Response): Promise<void> {
        if (!this.isValidHash(params) || params.cropArea.focalPoint === FocalPoint.SMART) {
            throw new BadRequestException("Invalid hash");
        }

        const file = await this.filesService.findOneById(params.fileId);

        if (file === null) {
            throw new NotFoundException();
        }

        if (params.contentHash && file.contentHash !== params.contentHash) {
            throw new BadRequestException("Content Hash mismatch!");
        }

        return this.getCroppedImage(file, params, accept, res, {
            "cache-control": "max-age=86400, public", // Public cache (1 day)
        });
    }

    private isValidHash({ hash, ...imageParams }: HashImageParams): boolean {
        return hash === this.imagesService.createHash(imageParams);
    }

    private async getCroppedImage(
        file: FileInterface,
        { cropArea, resizeWidth, resizeHeight, focalPoint }: ImageParams,
        accept: string,
        res: Response,
        overrideHeaders?: OutgoingHttpHeaders,
    ): Promise<void> {
        if (!file.image) {
            throw new NotFoundException();
        }

        let cropWidth: number;
        let cropHeight: number;
        let cropOffsetX: number;
        let cropOffsetY: number;
        let cropGravity: Gravity;

        const aspectRatio = resizeWidth / resizeHeight;

        if (focalPoint === FocalPoint.SMART) {
            const maxDimensions = getMaxDimensionsFromArea(
                {
                    width: file.image.width,
                    height: file.image.height,
                },
                aspectRatio,
            );

            cropWidth = maxDimensions.width;
            cropHeight = maxDimensions.height;
            cropOffsetX = 0;
            cropOffsetY = 0;
            cropGravity = Gravity.SMART;
        } else {
            const maxDimensions = getMaxDimensionsFromArea(
                {
                    width: file.image.width * ((cropArea.width as number) / 100),
                    height: file.image.height * ((cropArea.height as number) / 100),
                },
                aspectRatio,
            );
            const position = getCenteredPosition(
                maxDimensions,
                {
                    width: file.image.width * ((cropArea.width as number) / 100),
                    height: file.image.height * ((cropArea.height as number) / 100),
                    x: file.image.width * ((cropArea.x as number) / 100),
                    y: file.image.height * ((cropArea.y as number) / 100),
                },
                focalPoint,
            );

            cropWidth = maxDimensions.width;
            cropHeight = maxDimensions.height;
            cropOffsetX = position.x;
            cropOffsetY = position.y;
            cropGravity = Gravity.NORTHWEST;
        }

        const path = this.imgproxyService
            .builder()
            .crop(cropWidth, cropHeight, cropGravity, cropOffsetX, cropOffsetY)
            .resize(ResizingType.AUTO, resizeWidth)
            .format(
                (mime.getExtension(getSupportedMimeType(MODERN_TYPES, accept) || getSupportedMimeType(BASIC_TYPES, file.mimetype)) as Extension) ||
                    Extension.JPG,
            )
            .generateUrl(
                `${this.blobStorageBackendService.getBackendFilePathPrefix()}${this.config.filesDirectory}/${createHashedPath(file.contentHash)}`,
            );

        const cache = await this.cacheService.get(file.contentHash, path);
        if (!cache) {
            const response = await fetch(this.imgproxyService.getSignedUrl(path));
            const headers: Record<string, string> = {};
            for (const [key, value] of response.headers.entries()) {
                headers[key] = value;
            }

            res.writeHead(response.status, { ...headers, ...overrideHeaders });
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
            res.writeHead(200, { ...cache.metaData.headers, ...overrideHeaders });

            cache.file.pipe(res);
        }
    }
}
