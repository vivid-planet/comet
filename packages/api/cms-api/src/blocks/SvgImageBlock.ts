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
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

import { FILE_ENTITY } from "../dam/files/entities/file.entity";
import { FilesService } from "../dam/files/files.service";

// @TODO: make factory to support flexible validation
class SvgImageBlockData extends BlockData {
    damFileId?: string;

    async transformToPlain(
        { filesService }: { filesService: FilesService },
        { previewDamUrls, relativeDamUrls }: BlockContext,
    ): Promise<TraversableTransformResponse> {
        if (!this.damFileId) {
            return {};
        }

        const file = await filesService.findOneById(this.damFileId);

        if (!file) {
            return {};
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { createdAt, updatedAt, folder, copyOf, copies, ...data } = file;

        return {
            damFile: {
                ...data,
                image: {},
                license: {},
                fileUrl: await filesService.createFileUrl(file, { previewDamUrls, relativeDamUrls }),
            },
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

class SvgImageBlockInput extends BlockInput {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    damFileId?: string;

    transformToBlockData(): SvgImageBlockData {
        return inputToData(SvgImageBlockData, this);
    }
}

class Meta extends AnnotationBlockMeta {
    get fields(): BlockMetaField[] {
        const ret = super.fields;
        ret.push({
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
        });
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
        ];
    }
}

export const SvgImageBlock = createBlock(SvgImageBlockData, SvgImageBlockInput, {
    name: "SvgImage",
    blockMeta: new Meta(SvgImageBlockData),
    blockInputMeta: new InputMeta(SvgImageBlockInput),
});
