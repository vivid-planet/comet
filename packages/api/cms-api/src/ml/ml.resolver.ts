// Scaffolded by the CRUD generator on 2023-03-20.
import { Args, Mutation, Resolver } from "@nestjs/graphql";

import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { MlService } from "./ml.service";

@Resolver()
@RequiredPermission(["dam"], { skipScopeCheck: true })
export class MlResolver {
    constructor(private readonly mlService: MlService) {}

    @Mutation(() => String)
    async generateAltText(@Args("imageUrl", { type: () => String }) imageUrl: string): Promise<string> {
        return this.mlService.generateAltText(imageUrl);
    }

    @Mutation(() => String)
    async generateImageTitle(@Args("imageUrl", { type: () => String }) imageUrl: string): Promise<string> {
        return this.mlService.generateImageTitle(imageUrl);
    }
}
