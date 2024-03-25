import { Inject } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";

import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { CONTENT_GENERATION_SERVICE } from "./content-generation.constants";
import { ContentGenerationServiceInterface } from "./content-generation.service.interface";

@Resolver()
export class GenerateImageTitleResolver {
    @Inject(CONTENT_GENERATION_SERVICE) private contentGenerationService: ContentGenerationServiceInterface;

    @RequiredPermission(["dam"], { skipScopeCheck: true })
    @Mutation(() => String)
    async generateImageTitle(@Args("fileUrl", { type: () => String }) fileUrl: string): Promise<string> {
        return this.contentGenerationService.generateImageTitle?.(fileUrl) ?? "";
    }
}
