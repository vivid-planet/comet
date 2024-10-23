import { Injectable } from "@nestjs/common";

import { BlockContext, BlockTransformerServiceInterface, TraversableTransformBlockResponse } from "../../../blocks/block";
import { FilesService } from "../../files/files.service";
import { DamScopeInterface } from "../../types";
import { DamVideoBlockData } from "./dam-video.block";

type TransformResponse = {
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
        fileUrl: string;
    };
    autoplay?: boolean;
    loop?: boolean;
    showControls?: boolean;
};

@Injectable()
export class DamVideoBlockTransformerService implements BlockTransformerServiceInterface<DamVideoBlockData, TransformResponse> {
    constructor(private readonly filesService: FilesService) {}

    async transformToPlain(block: DamVideoBlockData, { previewDamUrls, relativeDamUrls }: BlockContext) {
        const ret: TraversableTransformBlockResponse = {
            autoplay: block.autoplay,
            loop: block.loop,
            showControls: block.showControls,
            previewImage: block.previewImage,
        };

        if (!block.damFileId) {
            return ret;
        }

        const file = await this.filesService.findOneById(block.damFileId);

        if (file) {
            ret.damFile = {
                id: file.id,
                name: file.name,
                size: file.size,
                mimetype: file.mimetype,
                contentHash: file.contentHash,
                title: file.title,
                altText: file.altText,
                archived: file.archived,
                scope: file.scope,
                fileUrl: await this.filesService.createFileUrl(file, { previewDamUrls, relativeDamUrls }),
            };
        }

        return ret;
    }
}
