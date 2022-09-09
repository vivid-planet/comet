import { Query, Resolver } from "@nestjs/graphql";

import { BuildTemplatesService } from "./build-templates.service";
import { BuildTemplateObject } from "./dto/build-template.object";

@Resolver(() => BuildTemplateObject)
export class BuildTemplatesResolver {
    constructor(private readonly buildTemplatesService: BuildTemplatesService) {}

    @Query(() => [BuildTemplateObject])
    async buildTemplates(): Promise<BuildTemplateObject[]> {
        return this.buildTemplatesService.getBuildTemplates();
    }
}
