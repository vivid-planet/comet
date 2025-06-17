import { BlockContext, BlockTransformerServiceInterface, TraversableTransformResponse } from "@comet/blocks-api";
import { Injectable } from "@nestjs/common";

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
    subtitles?: {
        file: {
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
        language: string;
    }[];
};

@Injectable()
export class DamVideoBlockTransformerService implements BlockTransformerServiceInterface<DamVideoBlockData, TransformResponse> {
    constructor(private readonly filesService: FilesService) {}

    async transformToPlain(block: DamVideoBlockData, { previewDamUrls, relativeDamUrls }: BlockContext) {
        const ret: TraversableTransformResponse = {
            autoplay: block.autoplay,
            loop: block.loop,
            showControls: block.showControls,
            previewImage: block.previewImage,
        };

        if (block.damFileId) {
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
        }

        if (ret.damFile && ret.damFile.id) {
            const videoFile = await this.filesService.findOneById(ret.damFile.id);
            if (videoFile && videoFile.subtitles) {
                ret.subtitles = [];
                for (const subtitle of videoFile.subtitles) {
                    const file = subtitle.file;
                    ret.subtitles.push({
                        file: {
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
                        },
                        language: subtitle.language,
                    });
                }
            }
        }

        return ret;
    }
}
