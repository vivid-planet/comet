import { Injectable } from "@nestjs/common";

import { BlockContext, BlockTransformerServiceInterface, TraversableTransformBlockResponse } from "../../blocks/block";
import { FilesService } from "../files/files.service";
import { DamFileDownloadLinkBlockData } from "./dam-file-download-link.block";

type TransformResponse = {
    damFile?: {
        id: string;
        name: string;
        fileUrl: string;
        size: number;
    };
};

@Injectable()
export class DamFileDownloadLinkBlockTransformerService implements BlockTransformerServiceInterface<DamFileDownloadLinkBlockData, TransformResponse> {
    constructor(private readonly filesService: FilesService) {}

    async transformToPlain(block: DamFileDownloadLinkBlockData, { includeInvisibleContent, previewDamUrls, relativeDamUrls }: BlockContext) {
        const ret: TraversableTransformBlockResponse = {
            openFileType: block.openFileType,
        };

        if (block.fileId === undefined) {
            return ret;
        }

        const file = await this.filesService.findOneById(block.fileId);

        if (file && block.openFileType === "NewTab") {
            ret.file = {
                id: file.id,
                name: file.name,
                fileUrl: await this.filesService.createFileUrl(file, { previewDamUrls, relativeDamUrls }),
                size: file.size,
                scope: file.scope,
            };
        } else if (file && block.openFileType === "Download") {
            ret.file = {
                id: file.id,
                name: file.name,
                fileUrl: await this.filesService.createFileDownloadUrl(file, { previewDamUrls, relativeDamUrls }),
                size: file.size,
                scope: file.scope,
            };
        }

        return ret;
    }
}
