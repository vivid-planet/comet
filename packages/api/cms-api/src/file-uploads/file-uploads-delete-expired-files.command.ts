import { CreateRequestContext, MikroORM } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { Command, CommandRunner } from "nest-commander";

import { FileUpload } from "./entities/file-upload.entity";

@Injectable()
@Command({
    name: "delete-expired-file-uploads",
    description: "Deletes all expired file uploads",
})
export class FileUploadsDeleteExpiredFilesCommand extends CommandRunner {
    constructor(
        @InjectRepository(FileUpload) private readonly repository: EntityRepository<FileUpload>,
        private readonly orm: MikroORM,
    ) {
        super();
    }

    @CreateRequestContext()
    async run(): Promise<void> {
        const result = await this.repository.nativeDelete({
            expiresAt: { $lt: new Date() },
        });
        console.log(`Deleted ${result} expired file uploads`);
    }
}
