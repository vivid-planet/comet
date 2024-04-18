import {
    AnnotationBlockMeta,
    BlockData,
    BlockDataInterface,
    BlockField,
    BlockIndexData,
    BlockInput,
    BlockMetaField,
    BlockMetaFieldKind,
    createBlock,
    inputToData,
} from "@comet/blocks-api";
import { IsBoolean, IsOptional, IsUUID } from "class-validator";

import { FILE_ENTITY } from "../dam/files/entities/file.entity";
import { DamVideoBlockTransformerService } from "./dam-video-block-transformer.service";

class DamVideoBlockData extends BlockData {
    damFileId?: string;

    @BlockField({ nullable: true })
    autoplay?: boolean;

    @BlockField({ nullable: true })
    loop?: boolean;

    @BlockField({ nullable: true })
    showControls?: boolean;

    async transformToPlain() {
        return DamVideoBlockTransformerService;
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
                            name: "scope",
                            kind: BlockMetaFieldKind.Json,
                            nullable: true,
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

export type { DamVideoBlockData };
