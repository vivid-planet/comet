import * as k8s from "@kubernetes/client-node";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import parser from "cron-parser";
import { addMinutes, differenceInMinutes } from "date-fns";
import fs from "fs";

import { BuildJobStatus } from "./build-job-status.enum";
import { AutoBuildStatus } from "./dto/auto-build-status.object";
import { BuildObject } from "./dto/build.object";
import { ChangesSinceLastBuild } from "./entities/changes-since-last-build.entity";

const JOB_HISTORY_LIMIT = 20;

@Injectable()
export class BuildsService {
    release = process.env.HELM_RELEASE;
    buildJobPrefix = "build";
    buildCheckerJobPrefix = "build-checker";

    localMode: boolean;
    namespace: string;
    batchApi: k8s.BatchV1Api;

    constructor(@InjectRepository(ChangesSinceLastBuild) private readonly changesRepository: EntityRepository<ChangesSinceLastBuild>) {
        const path = "/var/run/secrets/kubernetes.io/serviceaccount/namespace";
        this.localMode = !fs.existsSync(path);

        if (!this.localMode) {
            this.namespace = fs.readFileSync(path, "utf8");

            const kc = new k8s.KubeConfig();
            kc.loadFromCluster();
            this.batchApi = kc.makeApiClient(k8s.BatchV1Api);
        }
        // DEBUG-Code if used locally, you need to be logged in (e.g. by using oc login)
        /* else {
            this.namespace = "vivid-planet-comet-demo";
            this.release = "comet-demo";

            const kc = new k8s.KubeConfig();
            kc.loadFromDefault();
            this.batchApi = kc.makeApiClient(k8s.BatchV1Api);

            this.localMode = false;
        } */
    }

    async createBuild(trigger = "manual"): Promise<boolean> {
        if (this.localMode) {
            throw Error("Not available in local mode!");
        }

        const now = new Date();
        const buildDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        const buildTime = `${String(now.getHours()).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}-${String(
            now.getSeconds(),
        ).padStart(2, "0")}`;

        const cronJobs = await this.batchApi.listNamespacedCronJob(
            this.namespace,
            undefined,
            undefined,
            undefined,
            undefined,
            `instance = ${this.release}-${this.buildJobPrefix}`,
        );
        if (cronJobs.response.statusCode !== 200) {
            throw new Error("CronJobs not found!");
        }

        const jobs = await this.getSortedJobs({ labelFilter: `instance = ${this.release}-${this.buildJobPrefix}` });
        if (jobs.length > JOB_HISTORY_LIMIT - cronJobs.body.items.length) {
            for (const job of jobs.slice(JOB_HISTORY_LIMIT)) {
                const name = job.metadata?.name;
                if (!name) throw new Error(`Error deleting namespaced job: No name returned`);
                try {
                    await this.batchApi.deleteNamespacedJob(name, this.namespace);
                } catch (err) {
                    throw new Error(`Error deleting namespaced job: ${name}`);
                }
            }
        }

        for (const cronJob of cronJobs.body.items) {
            const jobs = await this.getSortedJobs({ labelFilter: `parentCronJob = ${cronJob.metadata?.name}` });
            const mostRecentJob = jobs.shift();
            if (mostRecentJob) {
                const status = this.getStatusForKubernetesJob(mostRecentJob);
                if (status === BuildJobStatus.active || status === BuildJobStatus.pending) {
                    console.warn(`Job for ${cronJob.metadata?.name} already running; skipping this run`);
                    continue;
                }
            }

            await this.batchApi.createNamespacedJob(this.namespace, {
                apiVersion: "batch/v1",
                kind: "Job",
                metadata: {
                    name: `${cronJob.metadata?.name}-${buildDate}-${buildTime}`,
                    annotations: { trigger: trigger },
                    labels: { instance: `${this.release}-${this.buildJobPrefix}`, parentCronJob: `${cronJob.metadata?.name}` },
                },
                spec: cronJob.spec?.jobTemplate.spec,
            });
        }

        return true;
    }

    async getBuilds(options?: { limit?: number | undefined }): Promise<BuildObject[]> {
        if (this.localMode) {
            throw Error("Not available in local mode!");
        }

        const sortedJobs = await this.getSortedJobs({ labelFilter: `instance = ${this.release}-${this.buildJobPrefix}` });

        return sortedJobs
            .map((job) => {
                return {
                    id: job.metadata?.uid as string, // uid can be null if the object is used for creating a Job, but not for reading
                    name: job.metadata?.name,
                    status: this.getStatusForKubernetesJob(job),
                    startTime: job.status?.startTime,
                    completionTime: job.status?.completionTime,
                    estimatedCompletionTime: this.getEstimatedCompletionTime(job, sortedJobs),
                    trigger: job.metadata?.annotations?.trigger,
                };
            })
            .slice(0, options?.limit);
    }

    async getAutoBuildStatus(): Promise<AutoBuildStatus> {
        if (this.localMode) {
            throw Error("Not available in local mode!");
        }

        const autoBuildStatus = new AutoBuildStatus();

        autoBuildStatus.hasChangesSinceLastBuild = await this.hasChangesSinceLastBuild();

        const cronJob = await this.batchApi.readNamespacedCronJob(`${this.release}-${this.buildCheckerJobPrefix}`, this.namespace);
        if (cronJob.response.statusCode !== 200) {
            throw new Error("CronJob not found!");
        }
        autoBuildStatus.lastCheck = cronJob.body.status?.lastScheduleTime;

        const interval = parser.parseExpression(cronJob.body.spec?.schedule as string);
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

    private getStatusForKubernetesJob(job: k8s.V1Job): BuildJobStatus {
        let status = BuildJobStatus.pending;
        if (job.status?.active ?? 0 > 0) {
            status = BuildJobStatus.active;
        }
        // A job can have both succeeded = 1 and failed = 1 states. This may happend due to a job's restart policy. For instance, a job may fail on
        // the first attempt (failed = 1) and succeed on the second attempt (succeeded = 1). We therefore check the succeeded status before the failed
        // status.
        else if (job.status?.succeeded ?? 0 > 0) {
            status = BuildJobStatus.succeeded;
        } else if (job.status?.failed ?? 0 > 0) {
            status = BuildJobStatus.failed;
        }
        return status;
    }

    private async getSortedJobs(options?: { labelFilter?: string }): Promise<k8s.V1Job[]> {
        const response = await this.batchApi.listNamespacedJob(this.namespace, undefined, undefined, undefined, undefined, options?.labelFilter);
        if (response.response.statusCode != 200) {
            throw new Error("Error listing Jobs");
        }
        return response.body.items.sort((a, b) => (b.metadata?.creationTimestamp?.getTime() || 0) - (a.metadata?.creationTimestamp?.getTime() || 0));
    }

    private getEstimatedCompletionTime(job: k8s.V1Job, sortedJobs: k8s.V1Job[]): Date | undefined {
        const jobStatus = this.getStatusForKubernetesJob(job);

        if (jobStatus === BuildJobStatus.failed || jobStatus === BuildJobStatus.succeeded) {
            return;
        }

        const jobStartTime = job.status?.startTime;

        if (jobStartTime === undefined) {
            return;
        }

        const previousJob = sortedJobs.find(
            (item) => this.hasSameParentCronJob(job, item) && this.getStatusForKubernetesJob(item) === BuildJobStatus.succeeded,
        );

        if (previousJob === undefined) {
            return;
        }

        const previousJobStartTime = previousJob.status?.startTime;
        const previousJobCompletionTime = previousJob.status?.completionTime;

        if (previousJobStartTime === undefined || previousJobCompletionTime === undefined) {
            return;
        }

        const previousJobRuntime = differenceInMinutes(previousJobCompletionTime, previousJobStartTime);
        const estimatedCompletionTime = addMinutes(jobStartTime, previousJobRuntime);

        return estimatedCompletionTime;
    }

    private hasSameParentCronJob(jobA: k8s.V1Job, jobB: k8s.V1Job): boolean {
        return jobA.metadata?.labels?.parentCronJob === jobB.metadata?.labels?.parentCronJob;
    }
}
