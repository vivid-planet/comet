import { Injectable } from "@nestjs/common";

import { BUILDER_LABEL, INSTANCE_LABEL } from "./builds.constants";
import { BuildTemplateObject } from "./dto/build-template.object";
import { KubernetesService } from "./kubernetes.service";

@Injectable()
export class BuildTemplatesService {
    constructor(private readonly kubernetesService: KubernetesService) {}

    async getBuildTemplates(): Promise<BuildTemplateObject[]> {
        if (this.kubernetesService.localMode) {
            throw Error("Not available in local mode!");
        }

        const builderCronJobs = await this.kubernetesService.getAllCronJobs(
            `${BUILDER_LABEL} = true, ${INSTANCE_LABEL} = ${this.kubernetesService.helmRelease}`,
        );

        return builderCronJobs.map((cronJob) => ({ id: cronJob.metadata?.uid as string, name: cronJob.metadata?.name as string }));
    }
}
