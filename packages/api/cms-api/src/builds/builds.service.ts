import { V1CronJob, V1Job } from "@kubernetes/client-node";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Inject, Injectable } from "@nestjs/common";
import parser from "cron-parser";
import { format } from "date-fns";

import { KubernetesJobStatus } from "../kubernetes/job-status.enum";
import { INSTANCE_LABEL, LABEL_ANNOTATION, PARENT_CRON_JOB_LABEL } from "../kubernetes/kubernetes.constants";
import { KubernetesService } from "../kubernetes/kubernetes.service";
import { CurrentUser } from "../user-permissions/dto/current-user";
import { ContentScope } from "../user-permissions/interfaces/content-scope.interface";
import { ACCESS_CONTROL_SERVICE } from "../user-permissions/user-permissions.constants";
import { AccessControlServiceInterface } from "../user-permissions/user-permissions.types";
import { BuildTemplatesService } from "./build-templates.service";
import { BUILDER_LABEL, TRIGGER_ANNOTATION } from "./builds.constants";
import { AutoBuildStatus } from "./dto/auto-build-status.object";
import { Build } from "./dto/build.object";
import { ChangesSinceLastBuild } from "./entities/changes-since-last-build.entity";

const JOB_HISTORY_LIMIT = 20;

@Injectable()
export class BuildsService {
    constructor(
        @InjectRepository(ChangesSinceLastBuild) private readonly changesRepository: EntityRepository<ChangesSinceLastBuild>,
        private readonly buildTemplatesService: BuildTemplatesService,
        private readonly kubernetesService: KubernetesService,
        @Inject(ACCESS_CONTROL_SERVICE) private accessControlService: AccessControlServiceInterface,
    ) {}

    private async getAllowedBuildJobs(user: CurrentUser): Promise<V1Job[]> {
        const allJobs = await this.kubernetesService.getAllJobs(`${BUILDER_LABEL} = true, ${INSTANCE_LABEL} = ${this.kubernetesService.helmRelease}`);
        return allJobs.filter((job) => {
            return this.accessControlService.isAllowed(user, "builds", this.kubernetesService.getContentScope(job) ?? {});
        });
    }

    async createBuilds(trigger: string, builderCronJobs: V1CronJob[]): Promise<boolean> {
        if (this.kubernetesService.localMode) {
            throw Error("Not available in local mode!");
        }

        // No ACL here, because this is only used for clean-up
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
                if (status === KubernetesJobStatus.active || status === KubernetesJobStatus.pending) {
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

    /**
     * Should only be used internally
     */
    async createBuildsForAllScopes(trigger: string): Promise<boolean> {
        const builderCronJobs = await this.kubernetesService.getAllCronJobs(
            `${BUILDER_LABEL} = true, ${INSTANCE_LABEL} = ${this.kubernetesService.helmRelease}`,
        );
        return this.createBuilds(trigger, builderCronJobs);
    }

    async getBuilds(user: CurrentUser, options?: { limit?: number | undefined }): Promise<Build[]> {
        if (this.kubernetesService.localMode) {
            throw Error("Not available in local mode!");
        }

        const buildJobs = await this.getAllowedBuildJobs(user);
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
                    label: job.metadata?.annotations?.[LABEL_ANNOTATION],
                };
            }),
        );
    }

    async getAutoBuildStatus(user: CurrentUser): Promise<AutoBuildStatus> {
        if (this.kubernetesService.localMode) {
            throw Error("Not available in local mode!");
        }

        const autoBuildStatus = new AutoBuildStatus();
        autoBuildStatus.hasChangesSinceLastBuild = await this.hasChangesSinceLastBuild();

        const cronJobs = await this.buildTemplatesService.getAllowedBuilderCronJobs(user);
        const cronJob = cronJobs?.[0];
        if (!cronJob) {
            throw new Error("BuildChecker CronJob not found.");
        }
        autoBuildStatus.lastCheck = cronJob.status?.lastScheduleTime;

        const interval = parser.parseExpression(cronJob.spec?.schedule as string);
        autoBuildStatus.nextCheck = interval.next().toDate();

        return autoBuildStatus;
    }

    async setChangesSinceLastBuild(scope: ContentScope | "all" = "all"): Promise<void> {
        const isEmptyScope = scope !== "all" && Object.keys(scope).length === 0; // Caused by features with optional scoping, e.g. redirects

        if (isEmptyScope) {
            scope = "all";
        }

        if ((await this.changesRepository.findOne({ scope })) === null) {
            await this.changesRepository.persistAndFlush(this.changesRepository.create({ scope }));
        }
    }

    async hasChangesSinceLastBuild(): Promise<boolean> {
        return (await this.changesRepository.count()) > 0;
    }

    async deleteChangesSinceLastBuild(): Promise<void> {
        await this.changesRepository.createQueryBuilder().truncate().execute();
    }

    async shouldRebuildAllScopes(): Promise<boolean> {
        return (await this.changesRepository.findOne({ scope: "all" })) !== null;
    }

    async getScopesWithChanges(): Promise<ContentScope[]> {
        return (await this.changesRepository.find({ scope: { $ne: "all" } })).map((change) => change.scope) as ContentScope[];
    }
}
