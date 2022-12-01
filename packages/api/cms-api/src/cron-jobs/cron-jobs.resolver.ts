import { Query, Resolver } from "@nestjs/graphql";

import { BUILDER_LABEL } from "../builds/builds.constants";
import { INSTANCE_LABEL } from "../kubernetes/kubernetes.constants";
import { KubernetesService } from "../kubernetes/kubernetes.service";
import { CronJobObject } from "./dto/cron-job.object";

@Resolver(() => CronJobObject)
export class CronJobsResolver {
    constructor(private readonly kubernetesService: KubernetesService) {}

    @Query(() => [CronJobObject])
    async cronJobs(): Promise<CronJobObject[]> {
        if (this.kubernetesService.localMode) {
            throw Error("Not available in local mode!");
        }

        const cronJobs = await this.kubernetesService.getAllCronJobs(
            `${INSTANCE_LABEL} = ${this.kubernetesService.getHelmRelase()}, ${BUILDER_LABEL} != true`,
        );
        return cronJobs.map((cronJob) => {
            return {
                id: cronJob.metadata?.uid as string,
                name: cronJob.metadata?.name as string,
                schedule: cronJob.spec?.schedule as string,
                lastScheduledAt: cronJob.status?.lastScheduleTime,
            };
        });
    }
}
