import { createHmac } from "node:crypto";
import { parse } from "node:path";

import { createHashedPath } from "../../blob-storage/blob-storage.js";
import { notFound } from "../../core/errors.js";
import type { ImgproxyGravity } from "../../imgproxy/imgproxy.js";
import type { FocalPoint } from "../common/focal-point.js";
import {
    getBasicImageMimeType,
    getCenteredPosition,
    getImageExtension,
    getMaxDimensionsFromArea,
    getSupportedMimeType,
    MODERN_TYPES,
} from "../common/images.util.js";
import type { DamServiceDependencies, DamServices } from "../dam.services.js";
import type { DamFile, DamFileImage, ImageCropArea } from "../dam.types.js";

export interface ImageParams {
    fileId: string;
    filename: string;
    cropArea: ImageCropArea;
    resizeWidth: number;
    resizeHeight: number;
}

function calculateInheritAspectRatio(image: Pick<DamFileImage, "width" | "height">, cropArea: ImageCropArea): number {
    if (cropArea.focalPoint === "SMART") {
        return image.width / image.height;
    }
    if (cropArea.width == null || cropArea.height == null) {
        throw new Error("Missing crop dimensions");
    }
    return (cropArea.width * image.width) / 100 / ((cropArea.height * image.height) / 100);
}

export class ImagesService {
    constructor(
        private readonly deps: DamServiceDependencies,
        private readonly services: DamServices,
    ) {}

    createHash({ fileId, filename, cropArea }: Pick<ImageParams, "fileId" | "filename" | "cropArea">): string {
        const fileHash = `file:${fileId}:${filename}`;
        const cropHash = ["crop", cropArea.width, cropArea.height, cropArea.focalPoint, cropArea.x, cropArea.y]
            .filter((value) => value !== null && value !== undefined)
            .join(":");
        return createHmac("sha1", this.deps.config.secret).update([fileHash, cropHash].join(":")).digest("hex");
    }

    createUrlTemplate(file: DamFile, { cropArea, previewDamUrls = false }: { cropArea?: ImageCropArea; previewDamUrls?: boolean } = {}): string {
        if (!file.image) {
            throw new Error(`File ${file.id} is not an image`);
        }
        const imageCropArea = cropArea ?? file.image.cropArea;
        const filename = this.createFilename(file);

        return [
            `/${this.deps.config.basePath}/images`,
            previewDamUrls ? "preview" : this.createHash({ fileId: file.id, filename, cropArea: imageCropArea }),
            file.contentHash,
            file.id,
            (imageCropArea.focalPoint !== "SMART"
                ? ["crop", imageCropArea.width, imageCropArea.height, imageCropArea.focalPoint, imageCropArea.x, imageCropArea.y]
                : ["crop", imageCropArea.focalPoint]
            ).join(":"),
            "resize:$resizeWidth:$resizeHeight",
            filename,
        ].join("/");
    }

    createUrl(
        file: DamFile,
        { cropArea, resizeWidth, resizeHeight }: { cropArea?: ImageCropArea; resizeWidth: number; resizeHeight: number },
    ): string {
        return this.createUrlTemplate(file, { cropArea }).replace("$resizeWidth", String(resizeWidth)).replace("$resizeHeight", String(resizeHeight));
    }

    createFilename(file: DamFile): string {
        const name = parse(file.name).name;
        // CDNs like Cloudflare (Vary for Images) don't cache a response whose type doesn't match the URL extension,
        // so the extension is the one of the format delivered when the Accept header offers no modern format.
        return this.deps.config.includeFormatExtensionInImageUrls ? `${name}.${getImageExtension(getBasicImageMimeType(file.mimetype))}` : name;
    }

    shouldRedirectToCurrentUrl(file: DamFile, filename: string): boolean {
        // The hash still validates for an outdated filename (one without extension or from before a rename) because it was signed for it.
        return this.deps.config.includeFormatExtensionInImageUrls === true && filename !== this.createFilename(file);
    }

    isAllowedImageSize(resizeWidth: number): boolean {
        return this.deps.config.allowedImageSizes.includes(resizeWidth);
    }

    isValidAspectRatio(file: DamFile, { resizeWidth, resizeHeight, cropArea }: ImageParams): boolean {
        for (const allowedAspectRatio of this.deps.config.allowedAspectRatios) {
            const [width, height] = allowedAspectRatio.split("x").map(Number);
            if (resizeHeight === Math.ceil(resizeWidth / (width / height))) {
                return true;
            }
        }
        if (!file.image) {
            return false;
        }
        return resizeHeight === Math.ceil(resizeWidth / calculateInheritAspectRatio(file.image, cropArea));
    }

    async fetchCroppedImage(file: DamFile, { cropArea, resizeWidth, resizeHeight }: ImageParams, accept: string): Promise<Response> {
        const { imgproxy, blobStorage, config } = this.deps;
        if (!file.image) {
            throw notFound();
        }
        if (!imgproxy) {
            throw new Error('DAM images require imgproxy. Provide it with app.use(provide("imgproxy", ...)).');
        }

        const crop = this.calculateCrop(file.image, cropArea, resizeWidth / resizeHeight);
        const fileName = createHashedPath(file.contentHash);
        const sourceUrl =
            blobStorage.getImgproxySourceUrl?.(config.filesDirectory, fileName) ??
            (config.publicApiUrl ? `${config.publicApiUrl}${this.services.files.createFileUrl(file)}` : undefined);
        if (!sourceUrl) {
            throw new Error(
                "The blob storage provides no imgproxy source URL. Set publicApiUrl in the DAM config to load images from their DAM URL.",
            );
        }

        const path = imgproxy
            .builder()
            .crop(crop)
            .resize({ width: resizeWidth })
            .format(getImageExtension(getSupportedMimeType(MODERN_TYPES, accept) ?? getBasicImageMimeType(file.mimetype)))
            .generateUrl(sourceUrl);

        return fetch(imgproxy.getSignedUrl(path));
    }

    private calculateCrop(
        image: DamFileImage,
        cropArea: ImageCropArea,
        aspectRatio: number,
    ): { width: number; height: number; x: number; y: number; gravity: ImgproxyGravity } {
        if (cropArea.focalPoint === "SMART") {
            return { ...getMaxDimensionsFromArea(image, aspectRatio), x: 0, y: 0, gravity: "sm" };
        }

        const area = {
            width: image.width * ((cropArea.width as number) / 100),
            height: image.height * ((cropArea.height as number) / 100),
            x: image.width * ((cropArea.x as number) / 100),
            y: image.height * ((cropArea.y as number) / 100),
        };
        const dimensions = getMaxDimensionsFromArea(area, aspectRatio);
        return { ...dimensions, ...getCenteredPosition(dimensions, area, cropArea.focalPoint as FocalPoint), gravity: "nowe" };
    }
}
