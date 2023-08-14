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
import { IsOptional, IsString, IsUUID } from "class-validator";
import { FilesService } from "src/dam/files/files.service";

import { IsUndefinable } from "../../common/validators/is-undefinable";

class DamFileDownloadLinkBlockData extends BlockData {
    fileId?: string;
    gtmElementType?: string;
    gtmElementName?: string;

    async transformToPlain(
        { filesService }: { filesService: FilesService },
        { previewDamUrls }: BlockContext,
    ): Promise<TraversableTransformResponse> {
        const ret: TraversableTransformResponse = {};

        if (this.gtmElementType || this.gtmElementName) {
            ret.tracking = {};
            if (this.gtmElementType) ret.tracking.gtmElementType = this.gtmElementType;
            if (this.gtmElementName) ret.tracking.gtmElementName = this.gtmElementName;
        }

        if (this.fileId === undefined) {
            return ret;
        }

        const file = await filesService.findOneById(this.fileId);

        if (file) {
            ret.file = {
                id: file.id,
                name: file.name,
                size: file.size,
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

    @IsOptional()
    @IsString()
    @BlockField({ nullable: true })
    gtmElementType?: string;

    @IsOptional()
    @IsString()
    @BlockField({ nullable: true })
    gtmElementName?: string;

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
                            name: "size",
                            kind: BlockMetaFieldKind.Number,
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
            {
                name: "tracking",
                kind: BlockMetaFieldKind.NestedObject,
                nullable: true,
                object: {
                    fields: [
                        {
                            name: "gtmElementType",
                            kind: BlockMetaFieldKind.String,
                            nullable: true,
                        },
                        {
                            name: "gtmElementName",
                            kind: BlockMetaFieldKind.String,
                            nullable: true,
                        },
                    ],
                },
            },
        ];
    }
}

export const DamFileDownloadLinkBlock = createBlock(DamFileDownloadLinkBlockData, DamFileDownloadLinkBlockInput, {
    name: "DamFileDownloadLink",
    blockMeta: new Meta(DamFileDownloadLinkBlockData),
});

export type { DamFileDownloadLinkBlockData, DamFileDownloadLinkBlockInput };
