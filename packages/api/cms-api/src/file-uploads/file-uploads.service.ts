import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import hasha from "hasha";
import { basename, extname } from "path";

import { BlobStorageBackendService } from "../blob-storage/backends/blob-storage-backend.service";
import { FileUploadInput } from "../dam/files/dto/file-upload.input";
import { slugifyFilename } from "../dam/files/files.utils";
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
}
