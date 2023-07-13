import { Query, Resolver } from "@nestjs/graphql";

import { CurrentUserInterface } from "../auth/current-user/current-user";
import { GetCurrentUser } from "../auth/decorators/get-current-user.decorator";
import { KubernetesService } from "../kubernetes/kubernetes.service";
import { PermissionCheck } from "../user-permissions/auth/permission-check";
import { USERPERMISSIONS } from "../user-permissions/user-permissions.types";
import { BuildTemplatesService } from "./build-templates.service";
import { BuildTemplateObject } from "./dto/build-template.object";

@Resolver(() => BuildTemplateObject)
@PermissionCheck({ allowedForPermissions: [USERPERMISSIONS.pageTree], skipScopeCheck: true })
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
