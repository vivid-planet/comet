import { Args, Context, Int, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { IncomingMessage } from "http";

import { RequiredPermission } from "../../user-permissions/decorators/required-permission.decorator";
import { DamFileImage } from "../files/entities/file-image.entity";
import { FilesService } from "../files/files.service";
import { ImagesService } from "./images.service";

@Resolver(() => DamFileImage)
@RequiredPermission(["dam"])
export class FileImagesResolver {
    constructor(
        private readonly imagesService: ImagesService,
        private readonly filesService: FilesService,
    ) {}

    @ResolveField(() => String, { nullable: true })
    async urlTemplate(@Parent() fileImage: DamFileImage, @Context("req") req: IncomingMessage): Promise<string | undefined> {
        return this.createUrlTemplate(fileImage, { previewDamUrls: Boolean(req.headers["x-preview-dam-urls"]) });
    }

    @ResolveField(() => String, { nullable: true })
    async url(
        @Args("width", { type: () => Int }) width: number,
        @Args("height", { type: () => Int }) height: number,
        @Parent() fileImage: DamFileImage,
        @Context("req") req: IncomingMessage,
    ): Promise<string | undefined> {
        const urlTemplate = await this.createUrlTemplate(fileImage, { previewDamUrls: Boolean(req.headers["x-preview-dam-urls"]) });

        return urlTemplate?.replace("$resizeWidth", String(width)).replace("$resizeHeight", String(height));
    }

    private async createUrlTemplate(fileImage: DamFileImage, { previewDamUrls }: { previewDamUrls: boolean }): Promise<string | undefined> {
        const file = await this.filesService.findOneByImageId(fileImage.id);

        if (!file) {
            return undefined;
        }

        // Preview URLs are used in the Admin, where the original image must stay visible
        if (!previewDamUrls && this.filesService.hasInvalidLicense(file)) {
            const fallbackImage = await this.filesService.findInvalidLicenseFallbackImage(file.scope);

            return fallbackImage ? this.imagesService.createUrlTemplate({ file: fallbackImage }, { previewDamUrls }) : undefined;
        }

        return this.imagesService.createUrlTemplate({ file }, { previewDamUrls });
    }
}
