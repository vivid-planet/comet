import { Query, Resolver } from "@nestjs/graphql";

import { CurrentUserInterface } from "../auth/current-user/current-user";
import { GetCurrentUser } from "../auth/decorators/get-current-user.decorator";
import { KubernetesService } from "../kubernetes/kubernetes.service";
import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { BuildTemplatesService } from "./build-templates.service";
import { LABEL_ANNOTATION } from "./builds.constants";
import { BuildTemplateObject } from "./dto/build-template.object";

@Resolver(() => BuildTemplateObject)
@RequiredPermission(["system"], { skipScopeCheck: true }) // Scopes are checked in Code
export class BuildTemplatesResolver {
    constructor(private readonly kubernetesService: KubernetesService, private readonly buildTemplatesService: BuildTemplatesService) {}

    @Query(() => [BuildTemplateObject])
    async buildTemplates(@GetCurrentUser() user: CurrentUserInterface): Promise<BuildTemplateObject[]> {
        if (this.kubernetesService.localMode) {
            throw Error("Not available in local mode!");
        }

        const builderCronJobs = await this.buildTemplatesService.getAllowedBuilderCronJobs(user);
        return builderCronJobs.map((cronJob) => ({
            id: cronJob.metadata?.uid as string,
            name: cronJob.metadata?.name as string,
            label: cronJob.metadata?.annotations?.[LABEL_ANNOTATION],
        }));
    }
}
