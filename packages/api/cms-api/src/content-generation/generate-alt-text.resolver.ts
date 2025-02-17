import { Inject } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";

import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { CONTENT_GENERATION_SERVICE } from "./content-generation.constants";
import { ContentGenerationServiceInterface } from "./content-generation-service.interface";

@Resolver()
export class GenerateAltTextResolver {
    @Inject(CONTENT_GENERATION_SERVICE) private contentGenerationService: ContentGenerationServiceInterface;

    @RequiredPermission(["dam"], { skipScopeCheck: true })
    @Mutation(() => String)
    async generateAltText(
        @Args("fileId", { type: () => String }) fileId: string,
        @Args("language", { type: () => String, nullable: true }) language?: string,
    ): Promise<string> {
        const altText = await this.contentGenerationService.generateAltText?.(fileId, { language: language ?? "en" });
        if (!altText) throw new Error("Alt text generation failed or is not supported");
        return altText;
    }
}
