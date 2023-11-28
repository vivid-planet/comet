import { mediaType } from "@hapi/accept";
import { Controller, ForbiddenException, forwardRef, Get, Headers, Inject, NotFoundException, Param, Res } from "@nestjs/common";
import { Response } from "express";
import { OutgoingHttpHeaders } from "http";
import mime from "mime";
import fetch from "node-fetch";
import { PassThrough } from "stream";

import { CurrentUserInterface } from "../../auth/current-user/current-user";
import { GetCurrentUser } from "../../auth/decorators/get-current-user.decorator";
import { DisableGlobalGuard } from "../../auth/decorators/global-guard-disable.decorator";
import { BlobStorageBackendService } from "../../blob-storage/backends/blob-storage-backend.service";
import { ACCESS_CONTROL_SERVICE } from "../../user-permissions/user-permissions.constants";
import { AccessControlServiceInterface } from "../../user-permissions/user-permissions.types";
import { ScaledImagesCacheService } from "../cache/scaled-images-cache.service";
import { FocalPoint } from "../common/enums/focal-point.enum";
import { CDN_ORIGIN_CHECK_HEADER, DamConfig } from "../dam.config";
import { DAM_CONFIG } from "../dam.constants";
import { FileInterface } from "../files/entities/file.entity";
import { FilesService } from "../files/files.service";
import { createHashedPath } from "../files/files.utils";
import { Extension, Gravity, ResizingType } from "../imgproxy/imgproxy.enum";
import { ImgproxyService } from "../imgproxy/imgproxy.service";
import { HashImageParams, ImageParams } from "./dto/image.params";
import { ImagesService } from "./images.service";
import { getCenteredPosition, getMaxDimensionsFromArea } from "./images.util";

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

const smartImageUrl = `:fileId/crop::focalPoint([A-Z]{5,9})/resize::resizeWidth::resizeHeight/:filename`;
const focusImageUrl = `:fileId/crop::cropWidth::cropHeight::focalPoint::cropX::cropY/resize::resizeWidth::resizeHeight/:filename`;

@Controller("dam/images")
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

    @Get(`/preview/${smartImageUrl}`)
    async previewSmartCroppedImage(
        @Param() params: ImageParams,
        @Headers("Accept") accept: string,
        @Res() res: Response,
        @GetCurrentUser() user: CurrentUserInterface,
    ): Promise<void> {
        if (params.cropArea.focalPoint !== FocalPoint.SMART) {
            throw new NotFoundException();
        }

        const file = await this.filesService.findOneById(params.fileId);

        if (file === null) {
            throw new NotFoundException();
        }

        if (file.scope !== undefined && !this.accessControlService.isAllowedContentScope(user, file.scope)) {
            throw new ForbiddenException();
        }

        return this.getCroppedImage(file, params, accept, res, {
            "cache-control": "private",
        });
    }

    @Get(`/preview/${focusImageUrl}`)
    async previewFocusCroppedImage(
        @Param() params: ImageParams,
        @Headers("Accept") accept: string,
        @Res() res: Response,
        @GetCurrentUser() user: CurrentUserInterface,
    ): Promise<void> {
        if (params.cropArea.focalPoint === FocalPoint.SMART) {
            throw new NotFoundException();
        }

        const file = await this.filesService.findOneById(params.fileId);

        if (file === null) {
            throw new NotFoundException();
        }

        if (file.scope !== undefined && !this.accessControlService.isAllowedContentScope(user, file.scope)) {
            throw new ForbiddenException();
        }

        return this.getCroppedImage(file, params, accept, res, {
            "cache-control": "private",
        });
    }

    @DisableGlobalGuard()
    @Get(`/:hash/${smartImageUrl}`)
    async smartCroppedImage(
        @Param() params: HashImageParams,
        @Headers("Accept") accept: string,
        @Headers(CDN_ORIGIN_CHECK_HEADER) cdnOriginCheck: string,
        @Res() res: Response,
    ): Promise<void> {
        this.checkCdnOrigin(cdnOriginCheck);

        if (!this.isValidHash(params) || params.cropArea.focalPoint !== FocalPoint.SMART) {
            throw new NotFoundException();
        }

        const file = await this.filesService.findOneById(params.fileId);

        if (file === null) {
            throw new NotFoundException();
        }

        return this.getCroppedImage(file, params, accept, res);
    }

    @DisableGlobalGuard()
    @Get(`/:hash/${focusImageUrl}`)
    async focusCroppedImage(
        @Param() params: HashImageParams,
        @Headers("Accept") accept: string,
        @Headers(CDN_ORIGIN_CHECK_HEADER) cdnOriginCheck: string,
        @Res() res: Response,
    ): Promise<void> {
        this.checkCdnOrigin(cdnOriginCheck);

        if (!this.isValidHash(params) || params.cropArea.focalPoint === FocalPoint.SMART) {
            throw new NotFoundException();
        }

        const file = await this.filesService.findOneById(params.fileId);

        if (file === null) {
            throw new NotFoundException();
        }

        return this.getCroppedImage(file, params, accept, res);
    }

    private isValidHash({ hash, ...imageParams }: HashImageParams): boolean {
        return hash === this.imagesService.createHash(imageParams);
    }

    private checkCdnOrigin(incomingCdnOriginHeader: string): void {
        if (this.config.cdnEnabled && !this.config.disableCdnOriginHeaderCheck) {
            if (incomingCdnOriginHeader !== this.config.cdnOriginHeader) {
                throw new ForbiddenException();
            }
        }
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
