import { Args, Int, Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { FileUpload } from "./entities/file-upload.entity";
import { FileUploadsService } from "./file-uploads.service";

@Resolver(() => FileUpload)
@RequiredPermission("fileUploads", { skipScopeCheck: true })
export class FileUploadsResolver {
    constructor(private readonly fileUploadsService: FileUploadsService) {}

    @ResolveField(() => String)
    downloadUrl(@Parent() fileUpload: FileUpload): string {
        return this.fileUploadsService.createDownloadUrl(fileUpload);
    }

    @ResolveField(() => String, { nullable: true })
    imageUrl(@Parent() fileUpload: FileUpload, @Args("resizeWidth", { type: () => Int }) resizeWidth: number): string | null {
        return this.fileUploadsService.createImageUrl(fileUpload, resizeWidth) ?? null;
    }
}
