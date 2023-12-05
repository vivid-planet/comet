import { V1Job } from "@kubernetes/client-node";
import { Injectable } from "@nestjs/common";

import { LABEL_ANNOTATION } from "../kubernetes/kubernetes.constants";
import { KubernetesService } from "../kubernetes/kubernetes.service";
import { Job } from "./dto/job.object";

@Injectable()
export class JobsService {
    constructor(private readonly kubernetesService: KubernetesService) {}

    convertKuberneteJobToJobObjectType(job: V1Job): Job {
        return {
            id: job.metadata?.uid as string,
            name: job.metadata?.name as string,
            label: job.metadata?.annotations?.[LABEL_ANNOTATION],
            startTime: job.status?.startTime,
            completionTime: job.status?.completionTime,
            status: this.kubernetesService.getStatusForKubernetesJob(job),
        };
    }
}
