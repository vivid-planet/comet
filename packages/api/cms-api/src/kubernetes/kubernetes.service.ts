import { BatchV1Api, CoreV1Api, KubeConfig, V1CronJob, V1Job, V1ObjectMeta, V1Pod } from "@kubernetes/client-node";
import { Inject, Injectable } from "@nestjs/common";
import { addMinutes, differenceInMinutes } from "date-fns";
import fs from "fs";

import { CONTENT_SCOPE_ANNOTATION } from "../builds/builds.constants";
import { ContentScope } from "../user-permissions/interfaces/content-scope.interface";
import { KubernetesJobStatus } from "./job-status.enum";
import { KUBERNETES_CONFIG, PARENT_CRON_JOB_LABEL } from "./kubernetes.constants";
import { KubernetesConfig } from "./kubernetes.module";

@Injectable()
export class KubernetesService {
    localMode: boolean;

    namespace: string;

    batchApi: BatchV1Api;
    coreApi: CoreV1Api;

    constructor(@Inject(KUBERNETES_CONFIG) readonly config: KubernetesConfig) {
        const path = "/var/run/secrets/kubernetes.io/serviceaccount/namespace";
        this.localMode = !fs.existsSync(path);

        const kc = new KubeConfig();

        if (!this.localMode) {
            this.namespace = fs.readFileSync(path, "utf8");

            kc.loadFromCluster();
            this.batchApi = kc.makeApiClient(BatchV1Api);
            this.coreApi = kc.makeApiClient(CoreV1Api);
        }
        // DEBUG-Code if used locally, you need to be logged in (e.g. by using oc login)
        /*else {
            this.namespace = "comet-demo";

            kc.loadFromDefault();
            this.batchApi = kc.makeApiClient(BatchV1Api);
            this.coreApi = kc.makeApiClient(CoreV1Api);
            this.localMode = false;
        }*/
    }

    get helmRelease(): string {
        return this.config.helmRelease;
    }

    async getCronJob(name: string): Promise<V1CronJob> {
        const { response, body } = await this.batchApi.readNamespacedCronJob(name, this.namespace);
        if (response.statusCode !== 200) {
            throw new Error(`Error fetching Job "${name}"`);
        }
        return body;
    }

    async getAllCronJobs(labelSelector: string): Promise<V1CronJob[]> {
        const { response, body } = await this.batchApi.listNamespacedCronJob(
            this.namespace,
            undefined,
            undefined,
            undefined,
            undefined,
            labelSelector,
        );
        if (response.statusCode !== 200) {
            throw new Error(`Error fetching CronJobs for selector "${labelSelector}"`);
        }

        return body.items;
    }

    async deleteJob(name: string): Promise<void> {
        const { response } = await this.batchApi.deleteNamespacedJob(name, this.namespace, undefined, undefined, undefined, undefined, "Background");
        if (response.statusCode !== 200) {
            throw new Error(`Error deleting Job "${name}"`);
        }
    }

    async getJob(name: string): Promise<V1Job> {
        const { response, body } = await this.batchApi.readNamespacedJob(name, this.namespace);
        if (response.statusCode !== 200) {
            throw new Error(`Error fetching Job "${name}"`);
        }
        return body;
    }

    async getPodsForJob(job: V1Job): Promise<V1Pod[]> {
        const { response, body } = await this.coreApi.listNamespacedPod(
            this.namespace,
            undefined,
            undefined,
            undefined,
            undefined,
            `job-name=${job.metadata?.name}`,
        );
        if (response.statusCode !== 200) {
            throw new Error(`Error fetching Job "${job.metadata?.name}"`);
        }

        return body.items;
    }

    async getPodLogs(pod: V1Pod): Promise<string> {
        const { response, body } = await this.coreApi.readNamespacedPodLog(pod.metadata?.name || "", this.namespace);
        if (response.statusCode !== 200) {
            throw new Error(`Error fetching logs for Pod "${pod.metadata?.name}"`);
        }

        return body;
    }

    async getJobLogs(job: V1Job): Promise<string> {
        let logs = "";

        const pods = await this.getPodsForJob(job);
        for (const pod of pods) {
            logs += await this.getPodLogs(pod);
        }

        return logs;
    }

    /**
     * Returns all Jobs for a labelFilter sorted by creationTimestamp DESC (most recent first)
     */
    async getAllJobs(labelFilter?: string): Promise<V1Job[]> {
        const { response, body } = await this.batchApi.listNamespacedJob(this.namespace, undefined, undefined, undefined, undefined, labelFilter);
        if (response.statusCode != 200) {
            throw new Error(`Error listing Jobs for labelFilter "${labelFilter}"`);
        }
        return body.items.sort((a, b) => (b.metadata?.creationTimestamp?.getTime() || 0) - (a.metadata?.creationTimestamp?.getTime() || 0));
    }

    async getAllJobsForCronJob(cronJob: string) {
        return this.getAllJobs(`${PARENT_CRON_JOB_LABEL}=${cronJob}`);
    }

    async getLatestJobForCronJob(cronJob: string) {
        const jobs = await this.getAllJobsForCronJob(cronJob);
        return jobs.shift();
    }

    async createJobFromCronJob(cronJob: V1CronJob, overwriteJobMetaData: V1ObjectMeta): Promise<V1Job> {
        const { response, body } = await this.batchApi.createNamespacedJob(this.namespace, {
            apiVersion: "batch/v1",
            kind: "Job",
            metadata: { ...cronJob.spec?.jobTemplate.metadata, ...overwriteJobMetaData },
            spec: cronJob.spec?.jobTemplate.spec,
        });
        if (response.statusCode !== 201) {
            throw new Error("Error creating Job");
        }

        return body;
    }

    getStatusForKubernetesJob(job: V1Job): KubernetesJobStatus {
        let status = KubernetesJobStatus.pending;
        if (job.status?.active ?? 0 > 0) {
            status = KubernetesJobStatus.active;
        }
        // A job can have both succeeded = 1 and failed = 1 states. This may happend due to a job's restart policy. For instance, a job may fail on
        // the first attempt (failed = 1) and succeed on the second attempt (succeeded = 1). We therefore check the succeeded status before the failed
        // status.
        else if (job.status?.succeeded ?? 0 > 0) {
            status = KubernetesJobStatus.succeeded;
        } else if (job.status?.failed ?? 0 > 0) {
            status = KubernetesJobStatus.failed;
        }
        return status;
    }

    /**
     * Estimate Job completion time based on previos run
     * Uses labelSelector to catch manual runs as well
     */
    async estimateJobCompletionTime(job: V1Job, labelSelector: string): Promise<Date | undefined> {
        const jobStatus = this.getStatusForKubernetesJob(job);
        if (jobStatus === KubernetesJobStatus.failed || jobStatus === KubernetesJobStatus.succeeded) {
            return;
        }

        const jobStartTime = job.status?.startTime;
        if (!jobStartTime) {
            return;
        }

        const previousJobs = await this.getAllJobs(labelSelector);
        if (!previousJobs || previousJobs.length < 1) {
            return;
        }
        const previousJob = previousJobs[0];

        const previousJobStartTime = previousJob.status?.startTime;
        const previousJobCompletionTime = previousJob.status?.completionTime;

        if (!previousJobStartTime || !previousJobCompletionTime) {
            return;
        }

        const previousJobRuntime = differenceInMinutes(previousJobCompletionTime, previousJobStartTime);
        const estimatedCompletionTime = addMinutes(jobStartTime, previousJobRuntime);

        return estimatedCompletionTime;
    }

    getContentScope(resource: V1Job | V1CronJob): ContentScope | null {
        const contentScopeAnnotation = resource.metadata?.annotations?.[CONTENT_SCOPE_ANNOTATION];
        return contentScopeAnnotation ? JSON.parse(contentScopeAnnotation) : null;
    }
}
