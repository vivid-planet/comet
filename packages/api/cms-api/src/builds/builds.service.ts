import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import parser from "cron-parser";
import { format } from "date-fns";

import { AutoBuildStatus } from "./dto/auto-build-status.object";
import { BuildObject } from "./dto/build.object";
import { ChangesSinceLastBuild } from "./entities/changes-since-last-build.entity";
import { JobStatus } from "./job-status.enum";
import { KubernetesService } from "./kubernetes.service";

const JOB_HISTORY_LIMIT = 20;

const BUILD_CHECKER_LABEL = "comet-dxp.com/build-checker";

const TRIGGER_ANNOTATION = "comet-dxp.com/trigger";

const BUILDER_LABEL = "comet-dxp.com/builder";
const INSTANCE_LABEL = "comet-dxp.com/instance";
const PARENT_CRON_JOB_LABEL = "comet-dxp.com/parent-cron-job";

@Injectable()
export class BuildsService {
    constructor(
        @InjectRepository(ChangesSinceLastBuild) private readonly changesRepository: EntityRepository<ChangesSinceLastBuild>,
        private readonly kubernetesService: KubernetesService,
    ) {}

    async createBuild(trigger = "manual"): Promise<boolean> {
        if (this.kubernetesService.localMode) {
            throw Error("Not available in local mode!");
        }

        const builderCronJobs = await this.kubernetesService.getAllCronJobs(
            `${BUILDER_LABEL} = true, ${INSTANCE_LABEL} = ${this.kubernetesService.helmRelease}`,
        );

        const builderJobs = await this.kubernetesService.getAllJobs(
            `${BUILDER_LABEL} = true, ${INSTANCE_LABEL} = ${this.kubernetesService.helmRelease}`,
        );
        if (builderJobs.length > JOB_HISTORY_LIMIT - builderCronJobs.length) {
            // Deletes all jobs except JOB_HISTORY_LIMIT most recent
            // This cleans Kubernetes as manually created jobs are not garbage collected by the CronJobController
            for (const job of builderJobs.slice(JOB_HISTORY_LIMIT)) {
                const name = job.metadata?.name;
                if (!name) {
                    throw new Error(`Error deleting namespaced job: No name returned`);
                }

                await this.kubernetesService.deleteJob(name);
            }
        }

        for (const cronJob of builderCronJobs) {
            const jobs = await this.kubernetesService.getAllJobs(`${PARENT_CRON_JOB_LABEL} = ${cronJob.metadata?.name}`);
            const mostRecentJob = jobs.shift();
            if (mostRecentJob) {
                // check if another build is already running and skip if so, to prevent overwhelming the cluster
                const status = this.kubernetesService.getStatusForKubernetesJob(mostRecentJob);
                if (status === JobStatus.active || status === JobStatus.pending) {
                    console.warn(`Job for ${cronJob.metadata?.name} already running; skipping this run`);
                    continue;
                }
            }

            await this.kubernetesService.createJobFromCronJob(cronJob, {
                name: `${cronJob.metadata?.name}-${format(new Date(), "yyyy-MM-dd-HH-mm-ss")}`,
                annotations: { [TRIGGER_ANNOTATION]: trigger },
            });
        }

        return true;
    }

    async getBuilds(options?: { limit?: number | undefined }): Promise<BuildObject[]> {
        if (this.kubernetesService.localMode) {
            throw Error("Not available in local mode!");
        }

        const buildJobs = await this.kubernetesService.getAllJobs(
            `${BUILDER_LABEL} = true, ${INSTANCE_LABEL} = ${this.kubernetesService.helmRelease}`,
        );

        return Promise.all(
            buildJobs.slice(0, options?.limit).map(async (job) => {
                return {
                    id: job.metadata?.uid as string, // uid can be null if the object is used for creating a Job, but not for reading
                    name: job.metadata?.name,
                    status: this.kubernetesService.getStatusForKubernetesJob(job),
                    startTime: job.status?.startTime,
                    completionTime: job.status?.completionTime,
                    estimatedCompletionTime: await this.kubernetesService.estimateJobCompletionTime(
                        job,
                        `${PARENT_CRON_JOB_LABEL} = ${job.metadata?.labels?.[PARENT_CRON_JOB_LABEL]}`,
                    ),
                    trigger: job.metadata?.annotations?.[TRIGGER_ANNOTATION],
                };
            }),
        );
    }

    async getAutoBuildStatus(): Promise<AutoBuildStatus> {
        if (this.kubernetesService.localMode) {
            throw Error("Not available in local mode!");
        }

        const autoBuildStatus = new AutoBuildStatus();
        autoBuildStatus.hasChangesSinceLastBuild = await this.hasChangesSinceLastBuild();

        const cronJobs = await this.kubernetesService.getAllCronJobs(
            `${BUILD_CHECKER_LABEL} = true, ${INSTANCE_LABEL} = ${this.kubernetesService.helmRelease}`,
        );
        const cronJob = cronJobs?.[0];
        if (!cronJob) {
            throw new Error("BuildChecker CronJob not found.");
        }
        autoBuildStatus.lastCheck = cronJob.status?.lastScheduleTime;

        const interval = parser.parseExpression(cronJob.spec?.schedule as string);
        autoBuildStatus.nextCheck = interval.next().toDate();

        return autoBuildStatus;
    }

    async setChangesSinceLastBuild(): Promise<void> {
        if ((await this.changesRepository.count()) < 1) {
            await this.changesRepository.persistAndFlush(this.changesRepository.create({}));
        }
    }

    async hasChangesSinceLastBuild(): Promise<boolean> {
        return (await this.changesRepository.count()) > 0;
    }

    async deleteChangesSinceLastBuild(): Promise<void> {
        await this.changesRepository.createQueryBuilder().truncate().execute();
    }
}
