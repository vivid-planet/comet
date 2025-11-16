import { Inject, UseGuards } from "@nestjs/common";
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { GetCurrentUser } from "../auth/decorators/get-current-user.decorator";
import { BUILDER_LABEL } from "../builds/builds.constants";
import { SkipBuild } from "../builds/skip-build.decorator";
import { KubernetesJobStatus } from "../kubernetes/job-status.enum";
import { INSTANCE_LABEL } from "../kubernetes/kubernetes.constants";
import { KubernetesService } from "../kubernetes/kubernetes.service";
import { KubernetesAuthenticationGuard } from "../kubernetes/kubernetes-authentication.guard";
import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { CurrentUser } from "../user-permissions/dto/current-user";
import { ACCESS_CONTROL_SERVICE } from "../user-permissions/user-permissions.constants";
import { AccessControlServiceInterface } from "../user-permissions/user-permissions.types";
import { CronJobsService } from "./cron-jobs.service";
import { CronJob } from "./dto/cron-job.object";
import { Job } from "./dto/job.object";
import { JobsService } from "./jobs.service";

@Resolver(() => CronJob)
@RequiredPermission(["cronJobs"], { skipScopeCheck: true })
@UseGuards(KubernetesAuthenticationGuard)
export class CronJobsResolver {
    constructor(
        private readonly kubernetesService: KubernetesService,
        private readonly cronJobsService: CronJobsService,
        private readonly jobsService: JobsService,
        @Inject(ACCESS_CONTROL_SERVICE) private accessControlService: AccessControlServiceInterface,
    ) {}

    @Query(() => [CronJob])
    async kubernetesCronJobs(@GetCurrentUser() user: CurrentUser): Promise<CronJob[]> {
        const cronJobs = await this.kubernetesService.getAllCronJobs(
            `${INSTANCE_LABEL} = ${this.kubernetesService.helmRelease}, ${BUILDER_LABEL} != true`,
        );
        return cronJobs
            .filter((cronJob) => {
                const contentScope = this.kubernetesService.getContentScope(cronJob);
                if (contentScope) {
                    return this.accessControlService.isAllowed(user, "builds", contentScope);
                }

                return true;
            })
            .map((cronJob) => this.cronJobsService.convertKubernetesCronJobToCronJobObjectType(cronJob));
    }

    @Query(() => CronJob)
    async kubernetesCronJob(@Args("name") name: string, @GetCurrentUser() user: CurrentUser): Promise<CronJob> {
        const cronJob = await this.kubernetesService.getCronJob(name);
        const contentScope = this.kubernetesService.getContentScope(cronJob);
        if (contentScope && !this.accessControlService.isAllowed(user, "builds", contentScope)) {
            throw new Error("Access denied");
        }

        return this.cronJobsService.convertKubernetesCronJobToCronJobObjectType(cronJob);
    }

    @Mutation(() => Job)
    @SkipBuild()
    async triggerKubernetesCronJob(@Args("name") name: string, @GetCurrentUser() user: CurrentUser): Promise<Job> {
        const cronJob = await this.kubernetesService.getCronJob(name);
        const contentScope = this.kubernetesService.getContentScope(cronJob);
        if (contentScope && !this.accessControlService.isAllowed(user, "builds", contentScope)) {
            throw new Error("Access denied");
        }

        const latestJobRun = await this.kubernetesService.getLatestJobForCronJob(name);
        if (latestJobRun) {
            const status = this.kubernetesService.getStatusForKubernetesJob(latestJobRun);
            if (status === KubernetesJobStatus.active || status === KubernetesJobStatus.pending) {
                throw new Error("Job is already running");
            }
        }

        const job = await this.kubernetesService.createJobFromCronJob(cronJob, { name: this.jobsService.createJobNameFromCronJobForManualRun(name) });
        return this.jobsService.convertKuberneteJobToJobObjectType(job);
    }

    @ResolveField(() => Job, { nullable: true })
    async lastJobRun(@Parent() cronJob: CronJob): Promise<Job | null> {
        const lastJobRun = await this.kubernetesService.getLatestJobForCronJob(cronJob.name);
        if (lastJobRun) {
            return this.jobsService.convertKuberneteJobToJobObjectType(lastJobRun);
        }

        return null;
    }
}
