import { EntityName, EventArgs, EventSubscriber } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { Inject, Injectable } from "@nestjs/common";

import { FileUpload } from "./entities/file-upload.entity";
import { FileUploadsConfig } from "./file-uploads.config";
import { FILE_UPLOADS_CONFIG } from "./file-uploads.constants";
import { FileUploadsService } from "./file-uploads.service";

@Injectable()
export class FileUploadExpirationSubscriber implements EventSubscriber {
    constructor(
        private readonly entityManager: EntityManager,
        private readonly fileUploadsService: FileUploadsService,
        @Inject(FILE_UPLOADS_CONFIG) private readonly config: FileUploadsConfig,
    ) {
        entityManager.getEventManager().registerSubscriber(this);
    }

    getSubscribedEntities(): EntityName<FileUpload>[] {
        return [FileUpload];
    }

    async onLoad(args: EventArgs<FileUpload>): Promise<void> {
        if (args.entity.expiresAt && args.entity.expiresAt < new Date()) {
            await this.fileUploadsService.delete(args.entity);
        }
    }
}
