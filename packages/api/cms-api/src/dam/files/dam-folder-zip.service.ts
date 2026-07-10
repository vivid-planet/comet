import { forwardRef, Inject, Injectable } from "@nestjs/common";
import JSZip from "jszip";

import { BlobStorageBackendService } from "../../blob-storage/backends/blob-storage-backend.service";
import { createHashedPath } from "../../blob-storage/utils/create-hashed-path.util";
import { DamConfig } from "../dam.config";
import { DAM_CONFIG } from "../dam.constants";
import { FilesService } from "./files.service";
import { FoldersService } from "./folders.service";

@Injectable()
export class DamFolderZipService {
    constructor(
        @Inject(forwardRef(() => FoldersService)) private readonly foldersService: FoldersService,
        @Inject(forwardRef(() => FilesService)) private readonly filesService: FilesService,
        @Inject(forwardRef(() => BlobStorageBackendService)) private readonly blobStorageBackendService: BlobStorageBackendService,
        @Inject(DAM_CONFIG) private readonly config: DamConfig,
    ) {}

    async createZipStreamFromFolder(folderId: string): Promise<NodeJS.ReadableStream> {
        const zip = new JSZip();

        await this.addFolderToZip(folderId, zip);

        return zip.generateNodeStream({ streamFiles: true });
    }

    private async addFolderToZip(folderId: string, zip: JSZip): Promise<void> {
        const files = await this.filesService.findAll({ folderId: folderId });
        const subfolders = await this.foldersService.findAllByParentId({ parentId: folderId });

        for (const file of files) {
            const fileStream = await this.blobStorageBackendService.getFile(this.config.filesDirectory, createHashedPath(file.contentHash));

            zip.file(file.name, fileStream);
        }
        const countedSubfolderNames: Record<string, number> = {};

        for (const subfolder of subfolders) {
            const subfolderName = subfolder.name;
            const updatedSubfolderName = this.getUniqueFolderName(subfolderName, countedSubfolderNames);

            const subfolderZip = zip.folder(updatedSubfolderName);
            if (!subfolderZip) {
                throw new Error(`Error while creating zip from folder with id ${folderId}`);
            }
            await this.addFolderToZip(subfolder.id, subfolderZip);
        }
    }

    private getUniqueFolderName(folderName: string, countedFolderNames: Record<string, number>) {
        if (!countedFolderNames[folderName]) {
            countedFolderNames[folderName] = 1;
        } else {
            countedFolderNames[folderName]++;
        }

        const duplicateCount = countedFolderNames[folderName];

        let updatedFolderName = folderName;
        if (duplicateCount > 1) {
            updatedFolderName = `${folderName} ${duplicateCount}`;
        }
        return updatedFolderName;
    }
}
