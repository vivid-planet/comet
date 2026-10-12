import { plainToInstance } from "class-transformer";
import type { Response } from "express";
import { describe, expect, it, vi } from "vitest";

import type { ScaledImagesCacheService } from "../../blob-storage/cache/scaled-images-cache.service";
import { FocalPoint } from "../../file-utils/focal-point.enum";
import { ImageFormat } from "../../file-utils/image-format.enum";
import { ImgproxyBuilder } from "../../imgproxy/imgproxy.builder";
import type { ImgproxyService } from "../../imgproxy/imgproxy.service";
import type { FileInterface } from "../files/entities/file.entity";
import type { FilesService } from "../files/files.service";
import { HashImageParams } from "./dto/image.params";
import { createImagesController } from "./images.controller";
import type { ImagesService } from "./images.service";

const FILE_ID = "11111111-1111-1111-1111-111111111111";
const HASH = "signed-hash";
const MODERN_ACCEPT_HEADER = "image/webp,image/*";

interface ImagesControllerForTest {
    smartCroppedImage(params: HashImageParams, accept: string, res: Response): Promise<void>;
    focusCroppedImage(params: HashImageParams, accept: string, res: Response): Promise<void>;
}

function createControllerWithCachedImage(file: FileInterface) {
    const filesService = { findOneById: vi.fn().mockResolvedValue(file) } as unknown as FilesService;
    const imagesService = { createHash: vi.fn().mockReturnValue(HASH) } as unknown as ImagesService;
    const imgproxyService = { builder: () => new ImgproxyBuilder(80) } as unknown as ImgproxyService;
    const cacheService = {
        get: vi.fn().mockResolvedValue({ file: { pipe: vi.fn() }, metaData: { contentType: "image/png", size: 1000 } }),
    } as unknown as ScaledImagesCacheService;
    const blobStorageBackendService = { getBackendFilePathPrefix: () => "" };

    const ImagesController = createImagesController({ damBasePath: "dam" });
    const controller = new (ImagesController as unknown as new (
        damConfig: unknown,
        imgproxyService: ImgproxyService,
        filesService: FilesService,
        imagesService: ImagesService,
        cacheService: ScaledImagesCacheService,
        blobStorageBackendService: unknown,
        scopeAccessControl: never,
    ) => ImagesControllerForTest)(
        { filesDirectory: "files" },
        imgproxyService,
        filesService,
        imagesService,
        cacheService,
        blobStorageBackendService,
        null as never,
    );

    return { controller, cacheService };
}

function createMockResponse(): Response {
    return {
        vary: vi.fn(),
        writeHead: vi.fn(),
    } as unknown as Response;
}

const pngFile = {
    id: FILE_ID,
    name: "photo.png",
    mimetype: "image/png",
    contentHash: "0123456789abcdef0123456789abcdef",
    scope: undefined,
    image: { width: 4000, height: 2000 },
} as FileInterface;

const handlers = [
    { name: "smartCroppedImage" as const, cropParams: { focalPoint: FocalPoint.SMART } },
    { name: "focusCroppedImage" as const, cropParams: { focalPoint: FocalPoint.CENTER, cropWidth: 100, cropHeight: 100, cropX: 0, cropY: 0 } },
];

describe.each(handlers)("ImagesController.$name", ({ name, cropParams }) => {
    function createParams(format?: ImageFormat): HashImageParams {
        return plainToInstance(HashImageParams, {
            hash: HASH,
            fileId: FILE_ID,
            ...cropParams,
            resizeWidth: 640,
            resizeHeight: 320,
            format,
            filename: "photo",
        });
    }

    it("negotiates a modern format via the Accept header and varies the response on it", async () => {
        const { controller, cacheService } = createControllerWithCachedImage(pngFile);
        const res = createMockResponse();

        await controller[name](createParams(), MODERN_ACCEPT_HEADER, res);

        expect(cacheService.get).toHaveBeenCalledWith(pngFile.contentHash, expect.stringContaining("/format:webp/"));
        expect(res.vary).toHaveBeenCalledWith("Accept");
    });

    it("delivers the original format without varying the response on the Accept header when the original format is requested", async () => {
        const { controller, cacheService } = createControllerWithCachedImage(pngFile);
        const res = createMockResponse();

        await controller[name](createParams(ImageFormat.ORIGINAL), MODERN_ACCEPT_HEADER, res);

        expect(cacheService.get).toHaveBeenCalledWith(pngFile.contentHash, expect.stringContaining("/format:png/"));
        expect(res.vary).not.toHaveBeenCalled();
    });
});
