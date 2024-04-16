import { BlockContext, BlockTransformerServiceInterface, ExtractBlockData } from "@comet/blocks-api";
import { Injectable } from "@nestjs/common";

import { FilesService } from "../dam/files/files.service";
import { ImageCropArea } from "../dam/images/entities/image-crop-area.entity";
import { ImagesService } from "../dam/images/images.service";
import { DamScopeInterface } from "../dam/types";
import { PixelImageBlock } from "./PixelImageBlock";

type TransformReturn = {
    damFile?: {
        id: string;
        name: string;
        size: number;
        mimetype: string;
        contentHash: string;
        title?: string;
        altText?: string;
        archived: boolean;
        scope?: DamScopeInterface;
        importSourceId?: string;
        importSourceType?: string;
        image?: {
            width: number;
            height: number;
            cropArea: ImageCropArea;
            dominantColor?: string;
        };
        fileUrl?: string;
    };
    cropArea?: ImageCropArea;
    urlTemplate?: string;
};

@Injectable()
export class PixelImageBlockTransformerService
    implements BlockTransformerServiceInterface<ExtractBlockData<typeof PixelImageBlock>, TransformReturn>
{
    constructor(private readonly filesService: FilesService, private readonly imagesService: ImagesService) {}

    async transformToPlain(
        block: ExtractBlockData<typeof PixelImageBlock>,
        { includeInvisibleContent, previewDamUrls, relativeDamUrls }: BlockContext,
    ) {
        if (!block.damFileId) {
            return {};
        }

        const file = await this.filesService.findOneById(block.damFileId);

        if (!file) {
            return {};
        }

        const fileUrl = includeInvisibleContent ? await this.filesService.createFileUrl(file, { previewDamUrls, relativeDamUrls }) : undefined;

        return {
            damFile: {
                id: file.id,
                name: file.name,
                size: file.size,
                mimetype: file.mimetype,
                contentHash: file.contentHash,
                title: file.title,
                altText: file.altText,
                archived: file.archived,
                scope: file.scope,
                importSourceId: file.importSourceId,
                importSourceType: file.importSourceType,
                image: file.image
                    ? {
                          width: file.image.width,
                          height: file.image.height,
                          cropArea: { ...file.image.cropArea },
                          dominantColor: file.image.dominantColor,
                      }
                    : undefined,
                fileUrl,
            },
            cropArea: block.cropArea ? { ...block.cropArea } : undefined,
            urlTemplate: this.imagesService.createUrlTemplate({ file, cropArea: block.cropArea }, { previewDamUrls, relativeDamUrls }),
        };
    }
}
