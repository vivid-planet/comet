import { V1CronJob } from "@kubernetes/client-node";
import { Injectable } from "@nestjs/common";

import { CurrentUserInterface } from "../auth/current-user/current-user";
import { ContentScopeService } from "../content-scope/content-scope.service";
import { INSTANCE_LABEL } from "../kubernetes/kubernetes.constants";
import { KubernetesService } from "../kubernetes/kubernetes.service";
import { BUILDER_LABEL } from "./builds.constants";

@Injectable()
export class BuildTemplatesService {
    constructor(private readonly kubernetesService: KubernetesService, private readonly contentScopeService: ContentScopeService) {}

    async getAllowedBuilderCronJobs(user: CurrentUserInterface): Promise<V1CronJob[]> {
        const allCronJobs = await this.kubernetesService.getAllCronJobs(
            `${BUILDER_LABEL} = true, ${INSTANCE_LABEL} = ${this.kubernetesService.helmRelease}`,
        );

        return allCronJobs.filter((cronJob) => {
            return this.contentScopeService.canAccessScope(this.kubernetesService.getContentScope(cronJob), user);
        });
    }
}
