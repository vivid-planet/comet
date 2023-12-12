import { Query, Resolver } from "@nestjs/graphql";

import { BUILDER_LABEL } from "../builds/builds.constants";
import { INSTANCE_LABEL } from "../kubernetes/kubernetes.constants";
import { KubernetesService } from "../kubernetes/kubernetes.service";
import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { CronJob } from "./dto/cron-job.object";

@Resolver(() => CronJob)
@RequiredPermission(["cronJobs"], { skipScopeCheck: true })
export class CronJobsResolver {
    constructor(private readonly kubernetesService: KubernetesService) {}

    @Query(() => [CronJob])
    async cronJobs(): Promise<CronJob[]> {
        if (this.kubernetesService.localMode) {
            throw Error("Not available in local mode!");
        }

        const cronJobs = await this.kubernetesService.getAllCronJobs(
            `${INSTANCE_LABEL} = ${this.kubernetesService.helmRelease}, ${BUILDER_LABEL} != true`,
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
