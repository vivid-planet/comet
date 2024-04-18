import { BlockContext, BlockTransformerServiceInterface } from "@comet/blocks-api";
import { Injectable } from "@nestjs/common";

import { FilesService } from "../dam/files/files.service";
import { DamScopeInterface } from "../dam/types";
import { SvgImageBlockData } from "./SvgImageBlock";

type TransformReturn = {
    damFile?: {
        id: string;
        name: string;
        size: number;
        mimetype: string;
        contentHash: string;
        title?: string;
        altText?: string;
        archived: boolean;
        scope?: DamScopeInterface;
        fileUrl?: string;
    };
};

@Injectable()
export class SvgImageBlockTransformerService implements BlockTransformerServiceInterface<SvgImageBlockData, TransformReturn> {
    constructor(private readonly filesService: FilesService) {}

    async transformToPlain(block: SvgImageBlockData, { includeInvisibleContent, previewDamUrls, relativeDamUrls }: BlockContext) {
        if (!block.damFileId) {
            return {};
        }

        const file = await this.filesService.findOneById(block.damFileId);

        if (!file) {
            return {};
        }

        const fileUrl = includeInvisibleContent ? await this.filesService.createFileUrl(file, { previewDamUrls, relativeDamUrls }) : undefined;

        return {
            damFile: {
                id: file.id,
                name: file.name,
                size: file.size,
                mimetype: file.mimetype,
                contentHash: file.contentHash,
                title: file.title,
                altText: file.altText,
                archived: file.archived,
                scope: file.scope,
                fileUrl,
            },
        };
    }
}
