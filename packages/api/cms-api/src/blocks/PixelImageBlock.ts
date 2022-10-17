import {
    AnnotationBlockMeta,
    BlockContext,
    BlockData,
    BlockIndexData,
    BlockInput,
    BlockMetaField,
    BlockMetaFieldKind,
    createBlock,
    inputToData,
    TraversableTransformResponse,
} from "@comet/blocks-api";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

import { FocalPoint } from "../dam/common/enums/focal-point.enum";
import { FilesService } from "../dam/files/files.service";
import { ImageCropAreaInput } from "../dam/images/dto/image-crop-area.input";
import { ImageCropArea } from "../dam/images/entities/image-crop-area.entity";
import { ImagesService } from "../dam/images/images.service";

// @TODO: make factory to support flexible validation
class PixelImageBlockData extends BlockData {
    damFileId?: string;

    @Type(() => ImageCropArea)
    cropArea?: ImageCropArea;

    async transformToPlain(
        { filesService, imagesService }: { filesService: FilesService; imagesService: ImagesService },
        { previewDamUrls }: BlockContext,
    ): Promise<TraversableTransformResponse> {
        if (!this.damFileId) {
            return {};
        }

        const file = await filesService.findOneById(this.damFileId);

        if (!file) {
            return {};
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { createdAt, updatedAt, folder, ...data } = file;

        return {
            damFile: {
                ...data,
                image: file.image
                    ? {
                          width: file.image.width,
                          height: file.image.height,
                          cropArea: { ...file.image.cropArea },
                          dominantColor: file.image.dominantColor,
                      }
                    : undefined,
                damPath: await filesService.getDamPath(file),
                fileUrl: await filesService.createFileUrl(file, previewDamUrls),
            },
            cropArea: this.cropArea ? { ...this.cropArea } : undefined,
            urlTemplate: imagesService.createUrlTemplate({ file, cropArea: this.cropArea }, previewDamUrls),
        };
    }

    async previewImageUrlTemplate(
        { filesService, imagesService }: { filesService: FilesService; imagesService: ImagesService },
        { previewDamUrls }: BlockContext,
    ): Promise<string | undefined> {
        if (!this.damFileId) {
            return undefined;
        }

        const file = await filesService.findOneById(this.damFileId);

        if (!file) {
            return undefined;
        }

        return imagesService.createUrlTemplate({ file, cropArea: this.cropArea }, previewDamUrls);
    }

    indexData(): BlockIndexData {
        return {
            damFileIds: this.damFileId ? [this.damFileId] : [],
        };
    }
}

class PixelImageBlockInput extends BlockInput {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    damFileId?: string;

    @Type(() => ImageCropAreaInput)
    @IsOptional()
    @ValidateNested()
    cropArea?: ImageCropAreaInput;

    transformToBlockData(): PixelImageBlockData {
        return inputToData(PixelImageBlockData, this);
    }
}

class Meta extends AnnotationBlockMeta {
    get fields(): BlockMetaField[] {
        const ret = super.fields;
        ret.push(
            {
                name: "damFile",
                kind: BlockMetaFieldKind.NestedObject,
                nullable: true,
                object: {
                    fields: [
                        {
                            name: "id",
                            kind: BlockMetaFieldKind.String,
                            nullable: false,
                        },
                        {
                            name: "name",
                            kind: BlockMetaFieldKind.String,
                            nullable: false,
                        },
                        {
                            name: "size",
                            kind: BlockMetaFieldKind.Number,
                            nullable: false,
                        },
                        {
                            name: "mimetype",
                            kind: BlockMetaFieldKind.String,
                            nullable: false,
                        },
                        {
                            name: "contentHash",
                            kind: BlockMetaFieldKind.String,
                            nullable: false,
                        },
                        {
                            name: "title",
                            kind: BlockMetaFieldKind.String,
                            nullable: true,
                        },
                        {
                            name: "altText",
                            kind: BlockMetaFieldKind.String,
                            nullable: true,
                        },
                        {
                            name: "archived",
                            kind: BlockMetaFieldKind.Boolean,
                            nullable: false,
                        },
                        {
                            name: "image",
                            kind: BlockMetaFieldKind.NestedObject,
                            object: {
                                fields: [
                                    {
                                        name: "width",
                                        kind: BlockMetaFieldKind.Number,
                                        nullable: false,
                                    },
                                    {
                                        name: "height",
                                        kind: BlockMetaFieldKind.Number,
                                        nullable: false,
                                    },
                                    cropArea(false),
                                    {
                                        name: "dominantColor",
                                        kind: BlockMetaFieldKind.String,
                                        nullable: true,
                                    },
                                ],
                            },
                            nullable: true,
                        },
                        {
                            name: "damPath",
                            kind: BlockMetaFieldKind.String,
                            nullable: false,
                        },
                        {
                            name: "fileUrl",
                            kind: BlockMetaFieldKind.String,
                            nullable: false,
                        },
                    ],
                },
            },
            cropArea(true),
            {
                name: "urlTemplate",
                kind: BlockMetaFieldKind.String,
                nullable: false,
            },
        );
        return ret;
    }
}

class InputMeta extends AnnotationBlockMeta {
    get fields(): BlockMetaField[] {
        return [
            ...super.fields,
            {
                name: "damFileId",
                kind: BlockMetaFieldKind.String,
                nullable: true,
            },
            cropArea(true),
        ];
    }
}

function cropArea(nullable: boolean): BlockMetaField {
    return {
        name: "cropArea",
        kind: BlockMetaFieldKind.NestedObject,
        nullable,
        object: {
            fields: [
                {
                    name: "focalPoint",
                    kind: BlockMetaFieldKind.Enum,
                    enum: Object.values(FocalPoint),
                    nullable: false,
                },
                {
                    name: "width",
                    kind: BlockMetaFieldKind.Number,
                    nullable: true,
                },
                {
                    name: "height",
                    kind: BlockMetaFieldKind.Number,
                    nullable: true,
                },
                {
                    name: "x",
                    kind: BlockMetaFieldKind.Number,
                    nullable: true,
                },
                {
                    name: "y",
                    kind: BlockMetaFieldKind.Number,
                    nullable: true,
                },
            ],
        },
    };
}

export const PixelImageBlock = createBlock(PixelImageBlockData, PixelImageBlockInput, {
    name: "PixelImage",
    blockMeta: new Meta(PixelImageBlockData),
    blockInputMeta: new InputMeta(PixelImageBlockInput),
});
