import {
    AnnotationBlockMeta,
    BlockContext,
    BlockData,
    BlockField,
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

export enum OpenFileTypeMethod {
    NEW_TAB = "NEW_TAB",
    DOWNLOAD = "DOWNLOAD",
}

class DamFileDownloadLinkBlockData extends BlockData {
    fileId?: string;

    @BlockField({ type: "enum", enum: OpenFileTypeMethod })
    openFileType: OpenFileTypeMethod;

    async transformToPlain(
        { filesService }: { filesService: FilesService },
        { previewDamUrls }: BlockContext,
    ): Promise<TraversableTransformResponse> {
        const ret: TraversableTransformResponse = {};

        ret.openFileType = this.openFileType;

        if (this.fileId === undefined) {
            return ret;
        }

        const file = await filesService.findOneById(this.fileId);

        if (file) {
            ret.file = {
                id: file.id,
                name: file.name,
                damPath: await filesService.getDamPath(file),
                fileUrl: await filesService.createFileUrl(file, previewDamUrls),
            };
        }

        return ret;
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
            ...super.fields,
        ];
    }
}

export const DamFileDownloadLinkBlock = createBlock(DamFileDownloadLinkBlockData, DamFileDownloadLinkBlockInput, {
    name: "DamFileDownloadLink",
    blockMeta: new Meta(DamFileDownloadLinkBlockData),
});
