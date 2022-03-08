import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import hasha from "hasha";
import { basename, extname } from "path";

import { BlobStorageBackendService } from "../blob-storage/backends/blob-storage-backend.service";
import { DamConfig } from "../dam/dam.config";
import { FileUploadInterface } from "../dam/files/dto/file-upload.interface";
import { slugifyFilename } from "../dam/files/files.utils";
import { PublicUpload } from "./entities/public-upload.entity";
import { PUBLIC_UPLOAD_CONFIG } from "./public-upload.constants";

@Injectable()
export class PublicUploadsService {
    constructor(
        @InjectRepository(PublicUpload) private readonly publicUploadsRepository: EntityRepository<PublicUpload>,
        @Inject(forwardRef(() => BlobStorageBackendService)) private readonly blobStorageBackendService: BlobStorageBackendService,
        @Inject(PUBLIC_UPLOAD_CONFIG) private readonly config: DamConfig,
    ) {}

    async upload(file: FileUploadInterface): Promise<PublicUpload> {
        const contentHash = await hasha.fromFile(file.path, { algorithm: "md5" });
        await this.blobStorageBackendService.upload(file, contentHash, this.config.filesDirectory);

        const extension = extname(file.originalname);
        const filename = basename(file.originalname, extension);
        const name = slugifyFilename(filename, extension);

        const publicUpload = this.publicUploadsRepository.create({
            name,
            size: file.size,
            mimetype: file.mimetype,
            contentHash,
        });

        this.publicUploadsRepository.persist(publicUpload);

        return publicUpload;
    }
}
