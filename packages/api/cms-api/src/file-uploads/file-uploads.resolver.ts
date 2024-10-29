import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Inject } from "@nestjs/common";
import { Args, ID, Int, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { FileUpload } from "./entities/file-upload.entity";
import { FileUploadsConfig } from "./file-uploads.config";
import { FILE_UPLOADS_CONFIG } from "./file-uploads.constants";
import { FileUploadsService } from "./file-uploads.service";

@Resolver(() => FileUpload)
@RequiredPermission("fileUploads", { skipScopeCheck: true })
export class FileUploadsResolver {
    constructor(
        private readonly fileUploadsService: FileUploadsService,
        @Inject(FILE_UPLOADS_CONFIG) private readonly config: FileUploadsConfig,
        @InjectRepository(FileUpload)
        private readonly repository: EntityRepository<FileUpload>,
    ) {}

    @Query(() => FileUpload)
    fileUpload(@Args("id", { type: () => ID }) id: string): Promise<FileUpload> {
        return this.repository.findOneOrFail(id);
    }

    @ResolveField(() => String, { nullable: true })
    downloadUrl(@Parent() fileUpload: FileUpload): string | null {
        if (!this.config.download) {
            return null;
        }

        return this.fileUploadsService.createDownloadUrl(fileUpload);
    }

    @ResolveField(() => String, { nullable: true })
    imageUrl(@Parent() fileUpload: FileUpload, @Args("resizeWidth", { type: () => Int }) resizeWidth: number): string | null {
        if (!this.config.download) {
            return null;
        }

        return this.fileUploadsService.createImageUrl(fileUpload, resizeWidth) ?? null;
    }
}
