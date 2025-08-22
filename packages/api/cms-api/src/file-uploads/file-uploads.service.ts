import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { createHmac } from "crypto";
import { addHours } from "date-fns";
import hasha from "hasha";
import { basename, extname, parse } from "path";
import { Readable } from "stream";

import { BlobStorageBackendService } from "../blob-storage/backends/blob-storage-backend.service";
import { createHashedPath } from "../blob-storage/utils/create-hashed-path.util";
import { FileUploadInput } from "../file-utils/file-upload.input";
import { slugifyFilename } from "../file-utils/files.utils";
import { ALL_TYPES } from "../file-utils/images.constants";
import { DownloadParams, ImageParams } from "./dto/file-uploads-download.params";
import { FileUpload } from "./entities/file-upload.entity";
import { FileUploadsConfig } from "./file-uploads.config";
import { FILE_UPLOADS_CONFIG } from "./file-uploads.constants";

@Injectable()
export class FileUploadsService {
    constructor(
        @InjectRepository(FileUpload) private readonly repository: EntityRepository<FileUpload>,
        @Inject(forwardRef(() => BlobStorageBackendService)) private readonly blobStorageBackendService: BlobStorageBackendService,
        @Inject(FILE_UPLOADS_CONFIG) private readonly config: FileUploadsConfig,
        private readonly entityManager: EntityManager,
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

        this.entityManager.persist(fileUpload);

        return fileUpload;
    }

    createHash(params: DownloadParams | ImageParams): string {
        if (!this.config.download) {
            throw new Error("File Uploads: Missing download configuration");
        }

        let hash = `file-upload:${params.id}:${params.timeout}`;

        if (params instanceof ImageParams) {
            hash += `:${params.resizeWidth}:${params.filename}`;
        }

        return createHmac("sha1", this.config.download.secret).update(hash).digest("hex");
    }

    createDownloadUrl(file: FileUpload): string {
        if (!this.config.download) {
            throw new Error("File Uploads: Missing download configuration");
        }

        const timeout = addHours(new Date(), 1).getTime();

        const hash = this.createHash({
            id: file.id,
            timeout,
        });

        return ["/file-uploads", hash, file.id, timeout].join("/");
    }

    createImageUrl(file: FileUpload, resizeWidth: number): string | undefined {
        if (!ALL_TYPES.includes(file.mimetype)) {
            return undefined;
        }

        const timeout = addHours(new Date(), 1).getTime();

        const hash = this.createHash({
            id: file.id,
            timeout,
            resizeWidth,
        });

        const filename = parse(file.name).name;

        return ["/file-uploads", hash, file.id, timeout, resizeWidth, filename].join("/");
    }

    async getFileContent(file: FileUpload): Promise<Buffer> {
        const filePath = createHashedPath(file.contentHash);
        const fileExists = await this.blobStorageBackendService.fileExists(this.config.directory, filePath);

        if (!fileExists) {
            throw new Error("File not found");
        }

        const stream = await this.blobStorageBackendService.getFile(this.config.directory, filePath);

        const chunks: Buffer[] = [];
        for await (const chunk of stream as Readable) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        const buffer = Buffer.concat(chunks);
        return buffer;
    }

    async delete(fileUpload: FileUpload): Promise<void> {
        const filePath = createHashedPath(fileUpload.contentHash);
        if (await this.blobStorageBackendService.fileExists(this.config.directory, filePath)) {
            await this.blobStorageBackendService.removeFile(this.config.directory, filePath);
        }

        this.entityManager.remove(fileUpload);
    }
}
