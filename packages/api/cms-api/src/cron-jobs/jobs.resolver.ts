import { Inject } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";

import { CurrentUserInterface } from "../auth/current-user/current-user";
import { GetCurrentUser } from "../auth/decorators/get-current-user.decorator";
import { KubernetesService } from "../kubernetes/kubernetes.service";
import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { ACCESS_CONTROL_SERVICE } from "../user-permissions/user-permissions.constants";
import { AccessControlServiceInterface } from "../user-permissions/user-permissions.types";
import { Job } from "./dto/job.object";
import { JobsService } from "./jobs.service";

@Resolver(() => Job)
@RequiredPermission(["cronJobs"], { skipScopeCheck: true })
export class JobsResolver {
    constructor(
        private readonly kubernetesService: KubernetesService,
        private readonly jobsService: JobsService,
        @Inject(ACCESS_CONTROL_SERVICE) private accessControlService: AccessControlServiceInterface,
    ) {}

    @Query(() => [Job])
    async kubernetesJobs(@Args("cronJobName") cronJobName: string, @GetCurrentUser() user: CurrentUserInterface): Promise<Job[]> {
        if (this.kubernetesService.localMode) {
            throw Error("Not available in local mode!");
        }

        const cronJob = await this.kubernetesService.getCronJob(cronJobName);
        const contentScope = this.kubernetesService.getContentScope(cronJob);
        if (contentScope && !this.accessControlService.isAllowed(user, "cronJobs", contentScope)) {
            throw new Error("Access denied");
        }

        const jobs = await this.kubernetesService.getAllJobsForCronJob(cronJobName);
        return jobs.map((job) => this.jobsService.convertKuberneteJobToJobObjectType(job));
    }
}
