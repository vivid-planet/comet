import { IsEnum, IsUUID } from "class-validator";

import { BlockData, BlockIndexData, BlockInput, blockInputToData, BlockMetaField, BlockMetaFieldKind, createBlock } from "../../blocks/block";
import { AnnotationBlockMeta, BlockField } from "../../blocks/decorators/field";
import { IsUndefinable } from "../../common/validators/is-undefinable";
import { FILE_ENTITY } from "../files/entities/file.entity";
import { DamFileDownloadLinkBlockTransformerService } from "./dam-file-download-link-block-transformer.service";

enum OpenFileTypeMethod {
    NewTab = "NewTab",
    Download = "Download",
}

export class DamFileDownloadLinkBlockData extends BlockData {
    fileId?: string;

    @BlockField({ type: "enum", enum: OpenFileTypeMethod })
    openFileType: OpenFileTypeMethod;

    async transformToPlain() {
        return DamFileDownloadLinkBlockTransformerService;
    }

    indexData(): BlockIndexData {
        if (this.fileId === undefined) {
            return {};
        }

        return {
            dependencies: [
                {
                    targetEntityName: FILE_ENTITY,
                    id: this.fileId,
                },
            ],
        };
    }
}

class DamFileDownloadLinkBlockInput extends BlockInput {
    @IsUndefinable()
    @IsUUID()
    @BlockField({ nullable: true })
    fileId?: string;

    @IsEnum(OpenFileTypeMethod)
    @BlockField({ type: "enum", enum: OpenFileTypeMethod })
    openFileType: OpenFileTypeMethod;

    transformToBlockData(): DamFileDownloadLinkBlockData {
        return blockInputToData(DamFileDownloadLinkBlockData, this);
    }
}

class Meta extends AnnotationBlockMeta {
    get fields(): BlockMetaField[] {
        return [
            {
                name: "file",
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
                            name: "fileUrl",
                            kind: BlockMetaFieldKind.String,
                            nullable: false,
                        },
                        {
                            name: "size",
                            kind: BlockMetaFieldKind.Number,
                            nullable: false,
                        },
                        {
                            name: "scope",
                            kind: BlockMetaFieldKind.Json,
                            nullable: true,
                        },
                        {
                            name: "altText",
                            kind: BlockMetaFieldKind.String,
                            nullable: true,
                        },
                        {
                            name: "title",
                            kind: BlockMetaFieldKind.String,
                            nullable: true,
                        },
                    ],
                },
            },
            ...super.fields,
        ];
    }
}

export const DamFileDownloadLinkBlock = createBlock(DamFileDownloadLinkBlockData, DamFileDownloadLinkBlockInput, {
    name: "DamFileDownloadLink",
    blockMeta: new Meta(DamFileDownloadLinkBlockData),
});
