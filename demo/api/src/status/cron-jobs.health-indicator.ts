import { KubernetesJobStatus, KubernetesService } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";
import { HealthIndicatorService } from "@nestjs/terminus";

@Injectable()
export class CronJobsHealthIndicator {
    constructor(
        private readonly kubernetesService: KubernetesService,
        private readonly healthIndicatorService: HealthIndicatorService,
    ) {}

    // TODO: add to library
    // TBD: maybe add option to ignore certain cron jobs... might also be added as annotation to the cron job object
    async isHealthy() {
        const failedCronJobs = [];

        const cronJobs = await this.kubernetesService.getAllProjectCronJobs();
        for (const cronJob of cronJobs) {
            const name = cronJob.metadata?.name as string;
            const lastJobRun = await this.kubernetesService.getLatestJobForCronJob(name);
            if (lastJobRun) {
                const status = this.kubernetesService.getStatusForKubernetesJob(lastJobRun);
                if (status === KubernetesJobStatus.failed) {
                    failedCronJobs.push(name);
                }
            }
        }

        const indicator = this.healthIndicatorService.check(`cron-jobs`);
        if (failedCronJobs.length > 0) {
            return indicator.down({ failedCronJobs: failedCronJobs });
        }

        return indicator.up();
    }
}
