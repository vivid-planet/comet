import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { format } from "date-fns";

import { CurrentUserInterface } from "../auth/current-user/current-user";
import { GetCurrentUser } from "../auth/decorators/get-current-user.decorator";
import { BUILDER_LABEL } from "../builds/builds.constants";
import { SkipBuild } from "../builds/skip-build.decorator";
import { ContentScopeService } from "../content-scope/content-scope.service";
import { KubernetesJobStatus } from "../kubernetes/job-status.enum";
import { INSTANCE_LABEL } from "../kubernetes/kubernetes.constants";
import { KubernetesService } from "../kubernetes/kubernetes.service";
import { CronJobsService } from "./cron-jobs.service";
import { CronJob } from "./dto/cron-job.object";
import { Job } from "./dto/job.object";
import { JobsService } from "./jobs.service";

@Resolver(() => CronJob)
export class CronJobsResolver {
    constructor(
        private readonly kubernetesService: KubernetesService,
        private readonly contentScopeService: ContentScopeService,
        private readonly cronJobsService: CronJobsService,
        private readonly jobsService: JobsService,
    ) {}

    @Query(() => [CronJob])
    async kubernetesCronJobs(@GetCurrentUser() user: CurrentUserInterface): Promise<CronJob[]> {
        if (this.kubernetesService.localMode) {
            throw Error("Not available in local mode!");
        }

        const cronJobs = await this.kubernetesService.getAllCronJobs(
            `${INSTANCE_LABEL} = ${this.kubernetesService.helmRelease}, ${BUILDER_LABEL} != true`,
        );
        return cronJobs
            .filter((cronJob) => {
                const contentScope = this.kubernetesService.getContentScope(cronJob);
                if (contentScope) {
                    return this.contentScopeService.canAccessScope(contentScope, user);
                }

                return true;
            })
            .map((cronJob) => this.cronJobsService.convertKubernetesCronJobToCronJobObjectType(cronJob));
    }

    @Query(() => CronJob)
    async kubernetesCronJob(@Args("name") name: string, @GetCurrentUser() user: CurrentUserInterface): Promise<CronJob> {
        if (this.kubernetesService.localMode) {
            throw Error("Not available in local mode!");
        }

        const cronJob = await this.kubernetesService.getCronJob(name);
        const contentScope = this.kubernetesService.getContentScope(cronJob);
        if (contentScope && !this.contentScopeService.canAccessScope(contentScope, user)) {
            throw new Error("Access denied");
        }

        return this.cronJobsService.convertKubernetesCronJobToCronJobObjectType(cronJob);
    }

    @Mutation(() => Job)
    @SkipBuild()
    async triggerKubernetesCronJob(@Args("name") name: string, @GetCurrentUser() user: CurrentUserInterface): Promise<Job> {
        const cronJob = await this.kubernetesService.getCronJob(name);
        const contentScope = this.kubernetesService.getContentScope(cronJob);
        if (contentScope && !this.contentScopeService.canAccessScope(contentScope, user)) {
            throw new Error("Access denied");
        }

        const latestJobRun = await this.kubernetesService.getLatestJobForCronJob(name);
        if (latestJobRun) {
            const status = this.kubernetesService.getStatusForKubernetesJob(latestJobRun);
            if (status === KubernetesJobStatus.active || status === KubernetesJobStatus.pending) {
                throw new Error("Job is already running");
            }
        }

        const job = await this.kubernetesService.createJobFromCronJob(cronJob, { name: `${name}-man-${format(new Date(), "yyyy-MM-dd-HH-mm-ss")}` });
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
