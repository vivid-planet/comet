import { Args, Int, Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { RequiredPermission } from "../../user-permissions/decorators/required-permission.decorator";
import { ImagesService } from "../images/images.service";
import { FileImage } from "./entities/file-image.entity";
import { FilesService } from "./files.service";

@Resolver(() => FileImage)
@RequiredPermission(["dam"])
export class FileImagesResolver {
    constructor(private readonly imagesService: ImagesService, private readonly filesService: FilesService) {}

    @ResolveField(() => String, { nullable: true })
    async url(
        @Args("width", { type: () => Int }) width: number,
        @Args("height", { type: () => Int }) height: number,
        @Parent() fileImage: FileImage,
    ): Promise<string | undefined> {
        const file = await this.filesService.findOneByImageId(fileImage.id);
        if (file) {
            const urlTemplate = this.imagesService.createUrlTemplate({ file });
            return urlTemplate.replace("$resizeWidth", String(width)).replace("$resizeHeight", String(height));
        }
    }
}
