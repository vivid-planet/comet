import {
    AnnotationBlockMeta,
    BlockContext,
    BlockData,
    BlockDataInterface,
    BlockField,
    BlockIndexData,
    BlockInput,
    BlockMetaField,
    BlockMetaFieldKind,
    createBlock,
    inputToData,
    TraversableTransformResponse,
} from "@comet/blocks-api";
import { IsBoolean, IsOptional, IsUUID } from "class-validator";

import { FILE_ENTITY } from "../dam/files/entities/file.entity";
import { FilesService } from "../dam/files/files.service";

class DamVideoBlockData extends BlockData {
    damFileId?: string;

    @BlockField({ nullable: true })
    autoplay?: boolean;

    @BlockField({ nullable: true })
    loop?: boolean;

    @BlockField({ nullable: true })
    showControls?: boolean;

    async transformToPlain(
        { filesService }: { filesService: FilesService },
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
        const { createdAt, updatedAt, folder, image, copyOf, copies, ...data } = file;

        return {
            damFile: {
                ...data,
                license: {},
                fileUrl: await filesService.createFileUrl(file, previewDamUrls),
            },
            autoplay: this.autoplay,
            loop: this.loop,
            showControls: this.showControls,
        };
    }

    indexData(): BlockIndexData {
        if (this.damFileId === undefined) {
            return {};
        }

        return {
            dependencies: [
                {
                    targetEntityName: FILE_ENTITY,
                    id: this.damFileId,
                },
            ],
        };
    }
}

class DamVideoBlockInput extends BlockInput {
    @BlockField({ nullable: true })
    @IsUUID()
    @IsOptional()
    damFileId?: string;

    @IsBoolean()
    @IsOptional()
    @BlockField({ nullable: true })
    autoplay?: boolean;

    @IsBoolean()
    @IsOptional()
    @BlockField({ nullable: true })
    loop?: boolean;

    @IsBoolean()
    @IsOptional()
    @BlockField({ nullable: true })
    showControls?: boolean;

    transformToBlockData(): BlockDataInterface {
        return inputToData(DamVideoBlockData, this);
    }
}

class Meta extends AnnotationBlockMeta {
    get fields(): BlockMetaField[] {
        return [
            ...super.fields,
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
                            name: "fileUrl",
                            kind: BlockMetaFieldKind.String,
                            nullable: false,
                        },
                    ],
                },
            },
        ];
    }
}

export const DamVideoBlock = createBlock(DamVideoBlockData, DamVideoBlockInput, { name: "DamVideo", blockMeta: new Meta(DamVideoBlockData) });
