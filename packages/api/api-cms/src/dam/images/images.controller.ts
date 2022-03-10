import { mediaType } from "@hapi/accept";
import { Controller, ForbiddenException, forwardRef, Get, Headers, Inject, NotFoundException, Param, Res } from "@nestjs/common";
import { Response } from "express";
import { OutgoingHttpHeaders } from "http";
import mime from "mime";
import fetch from "node-fetch";
import { PassThrough } from "stream";

import { BlobStorageBackendService } from "../..";
import { DisableGlobalGuard } from "../../auth/decorators/global-guard-disable.decorator";
import { ScaledImagesCacheService } from "../cache/scaled-images-cache.service";
import { FocalPoint } from "../common/enums/focal-point.enum";
import { CDN_ORIGIN_CHECK_HEADER, DamConfig } from "../dam.config";
import { DAM_CONFIG } from "../dam.constants";
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
    ) {}

    @Get(`/preview/${smartImageUrl}`)
    async previewSmartCroppedImage(@Param() params: ImageParams, @Headers("Accept") accept: string, @Res() res: Response): Promise<void> {
        if (params.cropArea.focalPoint !== FocalPoint.SMART) {
            throw new NotFoundException();
        }

        return this.getCroppedImage(params, accept, res, {
            "cache-control": "private",
        });
    }

    @Get(`/preview/${focusImageUrl}`)
    async previewFocusCroppedImage(@Param() params: ImageParams, @Headers("Accept") accept: string, @Res() res: Response): Promise<void> {
        if (params.cropArea.focalPoint === FocalPoint.SMART) {
            throw new NotFoundException();
        }

        return this.getCroppedImage(params, accept, res, {
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

        return this.getCroppedImage(params, accept, res);
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

        return this.getCroppedImage(params, accept, res);
    }

    private isValidHash({ hash, ...imageParams }: HashImageParams): boolean {
        return hash === this.imagesService.createHash(imageParams);
    }

    private checkCdnOrigin(incomingCdnOriginHeader: string): void {
        if (this.config.cdnEnabled) {
            if (incomingCdnOriginHeader !== this.config.cdnOriginHeader) {
                throw new ForbiddenException();
            }
        }
    }

    private async getCroppedImage(
        { fileId, cropArea, resizeWidth, resizeHeight, ...params }: ImageParams,
        accept: string,
        res: Response,
        overrideHeaders?: OutgoingHttpHeaders,
    ): Promise<void> {
        const file = await this.filesService.findOneById(fileId);
        if (!file || !file.image) throw new NotFoundException();

        const aspectRatio = resizeWidth / resizeHeight;
        const hasImageCropArea = params.focalPoint !== FocalPoint.SMART;
        const gravity = hasImageCropArea ? Gravity.NORTHWEST : Gravity.SMART;
        const width = hasImageCropArea ? file.image.width * ((cropArea.width as number) / 100) : file.image.width;
        const height = hasImageCropArea ? file.image.height * ((cropArea.height as number) / 100) : file.image.height;

        const maxDimensions = getMaxDimensionsFromArea(
            {
                width,
                height,
            },
            aspectRatio,
        );
        const position = hasImageCropArea
            ? getCenteredPosition(
                  maxDimensions,
                  {
                      width,
                      height,
                      x: hasImageCropArea ? file.image.width * ((cropArea.x as number) / 100) : 0,
                      y: hasImageCropArea ? file.image.height * ((cropArea.y as number) / 100) : 0,
                  },
                  cropArea.focalPoint,
              )
            : { x: 0, y: 0 };

        const path = this.imgproxyService
            .builder()
            .crop(maxDimensions.width, maxDimensions.height, gravity, position.x, position.y)
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
