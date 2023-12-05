import { Args, Query, Resolver } from "@nestjs/graphql";

import { CurrentUserInterface } from "../auth/current-user/current-user";
import { GetCurrentUser } from "../auth/decorators/get-current-user.decorator";
import { ContentScopeService } from "../content-scope/content-scope.service";
import { KubernetesService } from "../kubernetes/kubernetes.service";
import { Job } from "./dto/job.object";
import { JobsService } from "./jobs.service";

@Resolver(() => Job)
export class JobsResolver {
    constructor(
        private readonly kubernetesService: KubernetesService,
        private readonly contentScopeService: ContentScopeService,
        private readonly jobsService: JobsService,
    ) {}

    @Query(() => [Job])
    async kubernetesJobs(@Args("cronJob") cronJobName: string, @GetCurrentUser() user: CurrentUserInterface): Promise<Job[]> {
        if (this.kubernetesService.localMode) {
            throw Error("Not available in local mode!");
        }

        const cronJob = await this.kubernetesService.getCronJob(cronJobName);
        const contentScope = this.kubernetesService.getContentScope(cronJob);
        if (contentScope && !this.contentScopeService.canAccessScope(contentScope, user)) {
            throw new Error("Access denied");
        }

        const jobs = await this.kubernetesService.getAllJobsForCronJob(cronJobName);
        return jobs.map((job) => this.jobsService.convertKuberneteJobToJobObjectType(job));
    }
}
