import { Args, Mutation, Resolver } from "@nestjs/graphql";

import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { ContentGenerationService } from "./content-generation.service";

@Resolver()
export class ContentGenerationResolver {
    constructor(private readonly contentGenerationService: ContentGenerationService) {}

    @RequiredPermission(["dam"], { skipScopeCheck: true })
    @Mutation(() => String)
    async generateAltText(@Args("imageUrl", { type: () => String }) imageUrl: string): Promise<string> {
        return this.contentGenerationService.generateAltText(imageUrl);
    }

    @RequiredPermission(["dam"], { skipScopeCheck: true })
    @Mutation(() => String)
    async generateImageTitle(@Args("imageUrl", { type: () => String }) imageUrl: string): Promise<string> {
        return this.contentGenerationService.generateImageTitle(imageUrl);
    }
}
