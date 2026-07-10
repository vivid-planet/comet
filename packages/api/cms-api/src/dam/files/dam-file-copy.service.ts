import { EntityManager, Utils } from "@mikro-orm/postgresql";
import { forwardRef, Inject, Injectable } from "@nestjs/common";

import { DamMediaAlternative } from "./dam-media-alternatives/entities/dam-media-alternative.entity";
import { CreateFileInput, ImageFileInput } from "./dto/file.input";
import { FileInterface } from "./entities/file.entity";
import { FolderInterface } from "./entities/folder.entity";
import { FilesService } from "./files.service";
import { FoldersService } from "./folders.service";

@Injectable()
export class DamFileCopyService {
    constructor(
        @Inject(forwardRef(() => FilesService)) private readonly filesService: FilesService,
        private readonly foldersService: FoldersService,
        private readonly entityManager: EntityManager,
    ) {}

    async copyFilesToScope({ fileIds, inboxFolderId }: { fileIds: string[]; inboxFolderId: string }) {
        const inboxFolder = await this.foldersService.findOneById(inboxFolderId);
        if (!inboxFolder) {
            throw new Error("Specified inbox folder doesn't exist.");
        }

        const files = await this.filesService.findMultipleByIds(fileIds);
        if (files.length === 0) {
            throw new Error("No valid file ids provided");
        }

        const mappedFiles: Array<{ rootFile: FileInterface; copy: FileInterface }> = [];
        for (const file of files) {
            const copiedFile = await this.createCopyOfFile(file, { inboxFolder });
            mappedFiles.push({ rootFile: file, copy: copiedFile });
        }

        return { mappedFiles };
    }

    async createCopyOfFile(file: FileInterface, { inboxFolder }: { inboxFolder: FolderInterface }) {
        let fileImageInput: ImageFileInput | undefined;
        if (file.image) {
            const { id: ignoreId, file: ignoreFile, ...imageProps } = file.image;
            fileImageInput = { ...Utils.copy(imageProps) };
        }

        const {
            id: ignoreId,
            createdAt: ignoreCreatedAt,
            updatedAt: ignoreUpdatedAt,
            folder: ignoreFolder,
            image: ignoreImage,
            scope: ignoreScope,
            copies: ignoreCopies,
            alternativesForThisFile: ignoreAlternativesForThisFile,
            thisFileIsAlternativeFor: ignoreThisFileIsAlternativeFor,
            ...fileProps
        } = file;

        const fileInput: CreateFileInput & { copyOf: FileInterface } = {
            ...Utils.copy(fileProps),
            image: fileImageInput,
            folderId: inboxFolder.id,
            copyOf: file,
            scope: inboxFolder.scope,
        };

        const copiedFile = await this.filesService.create(fileInput);

        // handled DAM alternatives
        const copiedAlternatives: DamMediaAlternative[] = [];
        if ((await file.alternativesForThisFile.loadItems()).length > 0) {
            for (const alternative of file.alternativesForThisFile) {
                const alternativeFile = await alternative.alternative.load();
                if (alternativeFile === null) {
                    continue;
                }

                const copiedAlternativeFile = await this.createCopyOfFile(alternativeFile, { inboxFolder });

                const { id: ignoreId, for: ignoreFor, alternative: ignoreAlternative, ...alternativeProps } = alternative;
                const copiedDamMediaAlternative = this.entityManager.create(DamMediaAlternative, {
                    ...alternativeProps,

                    for: copiedFile,
                    alternative: copiedAlternativeFile,
                });

                copiedAlternatives.push(copiedDamMediaAlternative);
            }
        }

        copiedFile.alternativesForThisFile.set(copiedAlternatives);

        return copiedFile;
    }
}
