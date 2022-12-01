import { Query, Resolver } from "@nestjs/graphql";

import { CurrentUserInterface } from "../auth/current-user/current-user";
import { GetCurrentUser } from "../auth/decorators/get-current-user.decorator";
import { BuildTemplatesService } from "./build-templates.service";
import { BuildTemplateObject } from "./dto/build-template.object";
import { KubernetesService } from "./kubernetes.service";

@Resolver(() => BuildTemplateObject)
export class BuildTemplatesResolver {
    constructor(private readonly kubernetesService: KubernetesService, private readonly buildTemplatesService: BuildTemplatesService) {}

    @Query(() => [BuildTemplateObject])
    async buildTemplates(@GetCurrentUser() user: CurrentUserInterface): Promise<BuildTemplateObject[]> {
        if (this.kubernetesService.localMode) {
            throw Error("Not available in local mode!");
        }

        const builderCronJobs = await this.buildTemplatesService.getAllowedBuilderCronJobs(user);
        return builderCronJobs.map((cronJob) => ({ id: cronJob.metadata?.uid as string, name: cronJob.metadata?.name as string }));
    }
}
