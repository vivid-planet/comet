import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { createHmac } from "crypto";
import { addHours } from "date-fns";
import hasha from "hasha";
import { basename, extname } from "path";

import { BlobStorageBackendService } from "../blob-storage/backends/blob-storage-backend.service";
import { FileUploadInput } from "../dam/files/dto/file-upload.input";
import { slugifyFilename } from "../dam/files/files.utils";
import { DownloadParams } from "./dto/file-uploads-download.params";
import { FileUpload } from "./entities/file-upload.entity";
import { FileUploadsConfig } from "./file-uploads.config";
import { FILE_UPLOADS_CONFIG } from "./file-uploads.constants";

@Injectable()
export class FileUploadsService {
    constructor(
        @InjectRepository(FileUpload) private readonly repository: EntityRepository<FileUpload>,
        @Inject(forwardRef(() => BlobStorageBackendService)) private readonly blobStorageBackendService: BlobStorageBackendService,
        @Inject(FILE_UPLOADS_CONFIG) private readonly config: FileUploadsConfig,
    ) {}

    async upload(file: FileUploadInput): Promise<FileUpload> {
        const contentHash = await hasha.fromFile(file.path, { algorithm: "md5" });
        await this.blobStorageBackendService.upload(file, contentHash, this.config.directory);

        const extension = extname(file.originalname);
        const filename = basename(file.originalname, extension);
        const name = slugifyFilename(filename, extension);

        const fileUpload = this.repository.create({
            name,
            size: file.size,
            mimetype: file.mimetype,
            contentHash,
        });

        this.repository.persist(fileUpload);

        return fileUpload;
    }

    createHash(params: DownloadParams): string {
        if (!this.config.download) {
            throw new Error("File Uploads: Missing download configuration");
        }

        const hash = `file-upload:${params.id}:${params.timeout}`;

        return createHmac("sha1", this.config.download.secret).update(hash).digest("hex");
    }

    createDownloadUrl(file: FileUpload, { relativeUrls = false }: { relativeUrls?: boolean } = {}): string {
        if (!this.config.download) {
            throw new Error("File Uploads: Missing download configuration");
        }

        const baseUrl = `${relativeUrls ? "" : this.config.download.apiUrl}/file-uploads`;

        const timeout = addHours(new Date(), 1).getTime();

        const hash = this.createHash({
            id: file.id,
            timeout,
        });

        return [baseUrl, hash, file.id, timeout].join("/");
    }
}
