import { Inject } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";

import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { CONTENT_GENERATION_SERVICE } from "./content-generation.constants";
import { ContentGenerationServiceInterface, SeoTags } from "./content-generation-service.interface";

@Resolver()
export class GenerateSeoTagsResolver {
    @Inject(CONTENT_GENERATION_SERVICE) private contentGenerationService: ContentGenerationServiceInterface;

    @RequiredPermission(["pageTree"], { skipScopeCheck: true })
    @Mutation(() => SeoTags)
    async generateSeoTags(@Args("content", { type: () => String }) content: string): Promise<SeoTags> {
        const seoTags = await this.contentGenerationService.generateSeoTags?.(content);
        if (!seoTags) throw new Error("SEO tag generation failed or is not supported");
        return seoTags;
    }
}
