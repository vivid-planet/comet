import { forwardRef, Inject, Injectable } from "@nestjs/common";
import hasha from "hasha";
import { sep } from "path";

import { BlobStorageBackendService } from "../../blob-storage/backends/blob-storage-backend.service";
import { createHashedPath } from "../../blob-storage/utils/create-hashed-path.util";
import { DamConfig } from "../dam.config";
import { DAM_CONFIG } from "../dam.constants";
import { FileCache } from "./dto/file-cache.interface";

@Injectable()
export class ScaledImagesCacheService {
    constructor(
        @Inject(DAM_CONFIG) private readonly config: DamConfig,
        @Inject(forwardRef(() => BlobStorageBackendService)) private readonly blobStorageBackendService: BlobStorageBackendService,
    ) {}

    async get(fileIdentifier: string, scaleSettingsCacheKey: string): Promise<FileCache | undefined> {
        const path = [createHashedPath(fileIdentifier), hasha(scaleSettingsCacheKey, { algorithm: "md5" })].join(sep);

        if (await this.blobStorageBackendService.fileExists(this.config.cacheDirectory, path)) {
            const [file, metaData] = await Promise.all([
                this.blobStorageBackendService.getFile(this.config.cacheDirectory, path),
                this.blobStorageBackendService.getFileMetaData(this.config.cacheDirectory, path),
            ]);

            return {
                file,
                metaData,
            };
        }

        return undefined;
    }

    async set(fileIdentifier: string, scaleSettingsCacheKey: string, { file, metaData }: FileCache): Promise<void> {
        if (!(await this.blobStorageBackendService.folderExists(this.config.cacheDirectory))) {
            await this.blobStorageBackendService.createFolder(this.config.cacheDirectory);
        }

        const path = [createHashedPath(fileIdentifier), hasha(scaleSettingsCacheKey, { algorithm: "md5" })].join(sep);
        await this.blobStorageBackendService.createFile(this.config.cacheDirectory, path, file, {
            size: metaData.size,
            contentType: metaData.contentType,
        });
    }

    async delete(fileIdentifier: string, scaleSettingsCacheKey?: string): Promise<void> {
        const fileDirectory = createHashedPath(fileIdentifier);

        if (scaleSettingsCacheKey) {
            const path = [fileDirectory, hasha(scaleSettingsCacheKey, { algorithm: "md5" })].join(sep);
            try {
                await this.blobStorageBackendService.removeFile(this.config.cacheDirectory, path);
            } catch (e) {
                // empty
            }
        } else {
            try {
                await this.blobStorageBackendService.removeFile(this.config.cacheDirectory, fileDirectory);
            } catch (e) {
                // empty
            }
        }
    }
}
