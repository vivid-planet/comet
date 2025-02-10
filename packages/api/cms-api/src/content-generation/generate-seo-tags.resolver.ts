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

    @RequiredPermission(["pageTree"], { skipScopeCheck: true })
    @Mutation(() => String)
    async generateHtmlTitle(@Args("content", { type: () => String }) content: string): Promise<string> {
        const htmlTitle = (await this.contentGenerationService.generateSeoTags?.(content))?.htmlTitle;
        if (!htmlTitle) throw new Error("HTML title generation failed or is not supported");
        return htmlTitle;
    }

    @RequiredPermission(["pageTree"], { skipScopeCheck: true })
    @Mutation(() => String)
    async generateMetaDescription(@Args("content", { type: () => String }) content: string): Promise<string> {
        const metaDescription = (await this.contentGenerationService.generateSeoTags?.(content))?.metaDescription;
        if (!metaDescription) throw new Error("Meta description generation failed or is not supported");
        return metaDescription;
    }

    @RequiredPermission(["pageTree"], { skipScopeCheck: true })
    @Mutation(() => String)
    async generateOpenGraphTitle(@Args("content", { type: () => String }) content: string): Promise<string> {
        const openGraphTitle = (await this.contentGenerationService.generateSeoTags?.(content))?.openGraphTitle;
        if (!openGraphTitle) throw new Error("OpenGraph title generation failed or is not supported");
        return openGraphTitle;
    }

    @RequiredPermission(["pageTree"], { skipScopeCheck: true })
    @Mutation(() => String)
    async generateOpenGraphDescription(@Args("content", { type: () => String }) content: string): Promise<string> {
        const openGraphDescription = (await this.contentGenerationService.generateSeoTags?.(content))?.openGraphDescription;
        if (!openGraphDescription) throw new Error("OpenGraph description generation failed or is not supported");
        return openGraphDescription;
    }
}
