import {
    AnnotationBlockMeta,
    BlockDataInterface,
    BlockField,
    BlockIndexData,
    BlockMetaField,
    BlockMetaFieldKind,
    createBlock,
    inputToData,
    typesafeMigrationPipe,
} from "@comet/blocks-api";
import { IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { BaseVideoBlockData, BaseVideoBlockInput } from "../../../blocks/base-video-block";
import { FILE_ENTITY } from "../../files/entities/file.entity";
import { DamVideoBlockTransformerService } from "./dam-video-block-transformer.service";
import { AddPreviewImageMigration } from "./migrations/1-add-preview-image.migration";

class Subtitle {
    @BlockField({ nullable: true })
    @IsUUID()
    @IsOptional()
    fileId?: string;

    @BlockField()
    @IsString()
    language!: string;
}

class DamVideoBlockData extends BaseVideoBlockData {
    damFileId?: string;

    @Type(() => Subtitle)
    subtitles: Subtitle[] = [];

    async transformToPlain() {
        return DamVideoBlockTransformerService;
    }

    indexData(): BlockIndexData {
        const dependencies = [] as Array<{ targetEntityName: string; id: string }>;

        if (this.damFileId) {
            dependencies.push({ targetEntityName: FILE_ENTITY, id: this.damFileId });
        }

        for (const subtitle of this.subtitles) {
            if (subtitle.fileId) {
                dependencies.push({ targetEntityName: FILE_ENTITY, id: subtitle.fileId });
            }
        }

        if (dependencies.length === 0) {
            return {};
        }

        return {
            dependencies,
        };
    }
}

class DamVideoBlockInput extends BaseVideoBlockInput {
    @BlockField({ nullable: true })
    @IsUUID()
    @IsOptional()
    damFileId?: string;

    @Type(() => Subtitle)
    @ValidateNested({ each: true })
    subtitles: Subtitle[] = [];

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
            {
                name: "subtitles",
                kind: BlockMetaFieldKind.NestedObjectList,
                nullable: false,
                object: {
                    fields: [
                        {
                            name: "fileId",
                            kind: BlockMetaFieldKind.String,
                            nullable: true,
                        },
                        {
                            name: "language",
                            kind: BlockMetaFieldKind.String,
                            nullable: false,
                        },
                    ],
                },
            },
        ];
    }
}

export const DamVideoBlock = createBlock(DamVideoBlockData, DamVideoBlockInput, {
    name: "DamVideo",
    blockMeta: new Meta(DamVideoBlockData),
    migrate: {
        version: 1,
        migrations: typesafeMigrationPipe([AddPreviewImageMigration]),
    },
});

export type { DamVideoBlockData };
