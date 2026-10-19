import { describe, expect, it, vi } from "vitest";

import type { BlockContext } from "../../blocks/block";
import { FocalPoint } from "../../file-utils/focal-point.enum";
import type { DamConfig } from "../dam.config";
import type { FileInterface } from "../files/entities/file.entity";
import type { FilesService } from "../files/files.service";
import type { ImageCropArea } from "../images/entities/image-crop-area.entity";
import { ImagesService } from "../images/images.service";
import type { PixelImageBlockData } from "./pixel-image.block";
import { PixelImageBlockTransformerService } from "./pixel-image-block-transformer.service";

const blockCropArea = { focalPoint: FocalPoint.CENTER, width: 50, height: 50, x: 25, y: 25 } as ImageCropArea;

function createImageFile({ id, name, cropArea }: { id: string; name: string; cropArea: ImageCropArea }): FileInterface {
    return {
        id,
        name,
        mimetype: "image/png",
        contentHash: "0123456789abcdef0123456789abcdef",
        scope: { domain: "main" },
        image: { width: 4000, height: 2000, cropArea },
    } as unknown as FileInterface;
}

const originalImage = createImageFile({
    id: "11111111-1111-1111-1111-111111111111",
    name: "original.png",
    cropArea: { focalPoint: FocalPoint.SMART } as ImageCropArea,
});
const fallbackImage = createImageFile({
    id: "22222222-2222-2222-2222-222222222222",
    name: "fallback.png",
    cropArea: { focalPoint: FocalPoint.NORTHWEST, width: 80, height: 80, x: 10, y: 10 } as ImageCropArea,
});

function createTransformer({ hasExpiredLicense, fallback }: { hasExpiredLicense: boolean; fallback: FileInterface | null }) {
    const filesService = {
        findOneById: vi.fn().mockResolvedValue(originalImage),
        hasExpiredLicense: vi.fn().mockReturnValue(hasExpiredLicense),
        findExpiredLicenseFallbackImage: vi.fn().mockResolvedValue(fallback),
        createFileUrl: vi.fn(),
    } as unknown as FilesService;
    const imagesService = new ImagesService({ secret: "secret", basePath: "dam" } as DamConfig);

    return { transformer: new PixelImageBlockTransformerService(filesService, imagesService), filesService, imagesService };
}

const block = { damFileId: originalImage.id, cropArea: blockCropArea } as PixelImageBlockData;
const context = { includeInvisibleContent: false, previewDamUrls: false } as BlockContext;

describe("PixelImageBlockTransformerService", () => {
    it("renders the original image with the block's crop area when the license is valid", async () => {
        const { transformer, imagesService } = createTransformer({ hasExpiredLicense: false, fallback: fallbackImage });

        const result = await transformer.transformToPlain(block, context);

        expect(result.damFile?.id).toBe(originalImage.id);
        expect(result.cropArea).toEqual(blockCropArea);
        expect(result.urlTemplate).toBe(imagesService.createUrlTemplate({ file: originalImage, cropArea: blockCropArea }, {}));
    });

    it("renders the fallback image of the original image's scope with the fallback image's own crop area when the license has expired", async () => {
        const { transformer, filesService, imagesService } = createTransformer({ hasExpiredLicense: true, fallback: fallbackImage });

        const result = await transformer.transformToPlain(block, context);

        expect(filesService.findExpiredLicenseFallbackImage).toHaveBeenCalledWith(originalImage.scope);
        expect(result.damFile?.id).toBe(fallbackImage.id);
        expect(result.damFile?.image?.cropArea).toEqual(fallbackImage.image?.cropArea);
        expect(result.cropArea).toBeUndefined();
        expect(result.urlTemplate).toBe(imagesService.createUrlTemplate({ file: fallbackImage }, {}));
    });

    it("renders no image when the license has expired and no fallback image is set", async () => {
        const { transformer } = createTransformer({ hasExpiredLicense: true, fallback: null });

        await expect(transformer.transformToPlain(block, context)).resolves.toEqual({});
    });
});
