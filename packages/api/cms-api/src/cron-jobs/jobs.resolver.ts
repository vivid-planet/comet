import { Inject } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";

import { GetCurrentUser } from "../auth/decorators/get-current-user.decorator";
import { KubernetesService } from "../kubernetes/kubernetes.service";
import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { CurrentUser } from "../user-permissions/dto/current-user";
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
    async kubernetesJobs(@Args("cronJobName") cronJobName: string, @GetCurrentUser() user: CurrentUser): Promise<Job[]> {
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

    @Query(() => Job)
    async kubernetesJob(@Args("name") jobName: string, @GetCurrentUser() user: CurrentUser): Promise<Job> {
        if (this.kubernetesService.localMode) {
            throw Error("Not available in local mode!");
        }

        const job = await this.kubernetesService.getJob(jobName);
        const contentScope = this.kubernetesService.getContentScope(job);
        if (contentScope && !this.accessControlService.isAllowed(user, "cronJobs", contentScope)) {
            throw new Error("Access denied");
        }

        return this.jobsService.convertKuberneteJobToJobObjectType(job);
    }

    @Query(() => String)
    async kubernetesJobLogs(@Args("name") jobName: string, @GetCurrentUser() user: CurrentUser): Promise<string> {
        if (this.kubernetesService.localMode) {
            throw Error("Not available in local mode!");
        }

        const job = await this.kubernetesService.getJob(jobName);
        const contentScope = this.kubernetesService.getContentScope(job);
        if (contentScope && !this.accessControlService.isAllowed(user, "cronJobs", contentScope)) {
            throw new Error("Access denied");
        }

        return this.kubernetesService.getJobLogs(job);
    }
}
