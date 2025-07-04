import { UseGuards } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";

import { GetCurrentUser } from "../auth/decorators/get-current-user.decorator";
import { CometPermission } from "../common/enum/comet-permission.enum";
import { LABEL_ANNOTATION } from "../kubernetes/kubernetes.constants";
import { PreventLocalInvocationGuard } from "../kubernetes/prevent-local-invocation.guard";
import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { CurrentUser } from "../user-permissions/dto/current-user";
import { BuildTemplatesService } from "./build-templates.service";
import { BuildTemplateObject } from "./dto/build-template.object";

@Resolver(() => BuildTemplateObject)
@RequiredPermission([CometPermission.builds], { skipScopeCheck: true }) // Scopes are checked in Code
@UseGuards(PreventLocalInvocationGuard)
export class BuildTemplatesResolver {
    constructor(private readonly buildTemplatesService: BuildTemplatesService) {}

    @Query(() => [BuildTemplateObject])
    async buildTemplates(@GetCurrentUser() user: CurrentUser): Promise<BuildTemplateObject[]> {
        const builderCronJobs = await this.buildTemplatesService.getAllowedBuilderCronJobs(user);
        return builderCronJobs.map((cronJob) => ({
            id: cronJob.metadata?.uid as string,
            name: cronJob.metadata?.name as string,
            label: cronJob.metadata?.annotations?.[LABEL_ANNOTATION],
        }));
    }
}
