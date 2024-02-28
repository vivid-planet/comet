import { Args, Mutation, Resolver } from "@nestjs/graphql";

import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { ContentGenerationService } from "./content-generation.service";

@Resolver()
@RequiredPermission(["dam"], { skipScopeCheck: true })
export class ContentGenerationResolver {
    constructor(private readonly contentGenerationService: ContentGenerationService) {}

    @Mutation(() => String)
    async generateAltText(@Args("imageUrl", { type: () => String }) imageUrl: string): Promise<string> {
        return this.contentGenerationService.generateAltText(imageUrl);
    }

    @Mutation(() => String)
    async generateImageTitle(@Args("imageUrl", { type: () => String }) imageUrl: string): Promise<string> {
        return this.contentGenerationService.generateImageTitle(imageUrl);
    }
}
