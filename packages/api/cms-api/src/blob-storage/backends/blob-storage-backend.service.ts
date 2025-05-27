import { Inject, Injectable } from "@nestjs/common";
import { Readable } from "stream";

import { BlobStorageConfig } from "../blob-storage.config";
import { BLOB_STORAGE_CONFIG } from "../blob-storage.constants";
import { BlobStorageFileUploadInterface } from "../dto/blob-storage-file-upload.interface";
import { createHashedPath } from "../utils/create-hashed-path.util";
import { BlobStorageAzureStorage } from "./azure/blob-storage-azure.storage";
import { BlobStorageBackendInterface, CreateFileOptions, StorageMetaData } from "./blob-storage-backend.interface";
import { BlobStorageFileStorage } from "./file/blob-storage-file.storage";
import { BlobStorageS3Storage } from "./s3/blob-storage-s3.storage";

@Injectable()
export class BlobStorageBackendService implements BlobStorageBackendInterface {
    private readonly backend: BlobStorageBackendInterface;

    constructor(@Inject(BLOB_STORAGE_CONFIG) readonly config: BlobStorageConfig) {
        if (config.backend.driver === "file") {
            this.backend = new BlobStorageFileStorage(config.backend.file);
        } else if (config.backend.driver === "azure") {
            this.backend = new BlobStorageAzureStorage(config.backend.azure);
        } else if (config.backend.driver === "s3") {
            this.backend = new BlobStorageS3Storage(config.backend.s3);
        }
    }

    async folderExists(folderName: string): Promise<boolean> {
        return this.backend.folderExists(folderName);
    }

    async createFolder(folderName: string): Promise<void> {
        return this.backend.createFolder(folderName);
    }

    async removeFolder(folderName: string): Promise<void> {
        return this.backend.removeFolder(folderName);
    }

    async fileExists(folderName: string, fileName: string): Promise<boolean> {
        return this.backend.fileExists(folderName, fileName);
    }

    async createFile(
        folderName: string,
        fileName: string,
        data: NodeJS.ReadableStream | Buffer | string,
        { contentType, ...options }: CreateFileOptions,
    ): Promise<void> {
        return this.backend.createFile(folderName, fileName, data, { ...options, contentType: contentType });
    }

    async getFile(folderName: string, fileName: string): Promise<Readable> {
        return this.backend.getFile(folderName, fileName);
    }

    async getPartialFile(folderName: string, fileName: string, offset: number, length: number): Promise<Readable> {
        return this.backend.getPartialFile(folderName, fileName, offset, length);
    }

    async removeFile(folderName: string, fileName: string): Promise<void> {
        return this.backend.removeFile(folderName, fileName);
    }

    async getFileMetaData(folderName: string, fileName: string): Promise<StorageMetaData> {
        return this.backend.getFileMetaData(folderName, fileName);
    }

    getBackendFilePathPrefix(): string {
        return this.backend.getBackendFilePathPrefix();
    }

    async upload(file: BlobStorageFileUploadInterface, contentHash: string, folderName: string): Promise<void> {
        if (!(await this.folderExists(folderName))) {
            await this.createFolder(folderName);
        }

        const objectName = createHashedPath(contentHash);

        if (!(await this.fileExists(folderName, objectName))) {
            await this.createFile(folderName, objectName, file.path, {
                size: file.size,
                contentType: file.mimetype,
            });
        }
    }
}
