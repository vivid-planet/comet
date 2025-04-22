import { Injectable } from "@nestjs/common";

import { BlockContext, BlockTransformerServiceInterface } from "../../blocks/block";
import { FilesService } from "../files/files.service";
import { DamScopeInterface } from "../types";
import { DamFileDownloadLinkBlockData, OpenFileTypeMethod } from "./dam-file-download-link.block";

type File = {
    id: string;
    name: string;
    fileUrl: string;
    size: number;
    mimetype: string;
    scope?: DamScopeInterface;
    altText?: string;
    title?: string;
};

type TransformResponse = {
    file?: File;
    openFileType: OpenFileTypeMethod;
};

@Injectable()
export class DamFileDownloadLinkBlockTransformerService implements BlockTransformerServiceInterface<DamFileDownloadLinkBlockData, TransformResponse> {
    constructor(private readonly filesService: FilesService) {}

    async transformToPlain(block: DamFileDownloadLinkBlockData, { includeInvisibleContent, previewDamUrls }: BlockContext) {
        const ret: TransformResponse = {
            openFileType: block.openFileType,
        };

        if (block.fileId === undefined) {
            return ret;
        }

        const file = await this.filesService.findOneById(block.fileId);

        if (file) {
            const retFile: Omit<File, "fileUrl"> = {
                id: file.id,
                name: file.name,
<<<<<<< HEAD
                size: file.size,
=======
                size: Number(file.size),
                mimetype: file.mimetype,
>>>>>>> main
                scope: file.scope,
                altText: file.altText,
                title: file.title,
            };

            if (block.openFileType === "NewTab") {
                ret.file = {
                    ...retFile,
                    fileUrl: await this.filesService.createFileUrl(file, { previewDamUrls }),
                };
            } else if (block.openFileType === "Download") {
                ret.file = {
                    ...retFile,
                    fileUrl: await this.filesService.createFileDownloadUrl(file, { previewDamUrls }),
                };
            }
        }

        return ret;
    }
}
