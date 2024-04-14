import {
    AnnotationBlockMeta,
    BlockContext,
    BlockData,
    BlockField,
    BlockIndexData,
    BlockInput,
    BlockMetaField,
    BlockMetaFieldKind,
    createBlock,
    inputToData,
    TraversableTransformResponse,
} from "@comet/blocks-api";
import { IsEnum, IsUUID } from "class-validator";
import { FilesService } from "src/dam/files/files.service";

import { IsUndefinable } from "../../common/validators/is-undefinable";
import { FILE_ENTITY } from "../../dam/files/entities/file.entity";

export enum OpenFileTypeMethod {
    NewTab = "NewTab",
    Download = "Download",
}

class DamFileDownloadLinkBlockData extends BlockData {
    fileId?: string;

    @BlockField({ type: "enum", enum: OpenFileTypeMethod })
    openFileType: OpenFileTypeMethod;

    async transformToPlain(
        { filesService }: { filesService: FilesService },
        { previewDamUrls }: BlockContext,
    ): Promise<TraversableTransformResponse> {
        const ret: TraversableTransformResponse = {
            openFileType: this.openFileType,
        };

        if (this.fileId === undefined) {
            return ret;
        }

        const file = await filesService.findOneById(this.fileId);

        if (file) {
            ret.file = {
                id: file.id,
                name: file.name,
                fileUrl: await filesService.createFileUrl(file, previewDamUrls),
            };
        }

        return ret;
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
        return inputToData(DamFileDownloadLinkBlockData, this);
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
