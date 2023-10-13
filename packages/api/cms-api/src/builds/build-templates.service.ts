import { V1CronJob } from "@kubernetes/client-node";
import { Injectable } from "@nestjs/common";

import { CurrentUserInterface } from "../auth/current-user/current-user";
import { INSTANCE_LABEL } from "../kubernetes/kubernetes.constants";
import { KubernetesService } from "../kubernetes/kubernetes.service";
import { ContentScopeService } from "../user-permissions/content-scope.service";
import { BUILDER_LABEL } from "./builds.constants";

@Injectable()
export class BuildTemplatesService {
    constructor(private readonly kubernetesService: KubernetesService, private readonly contentScopeService: ContentScopeService) {}

    async getAllowedBuilderCronJobs(user: CurrentUserInterface): Promise<V1CronJob[]> {
        return (await this.getAllBuilderCronJobs()).filter((cronJob) => {
            return this.contentScopeService.canAccessScope(this.kubernetesService.getContentScope(cronJob), user);
        });
    }

    async getAllBuilderCronJobs(): Promise<V1CronJob[]> {
        return this.kubernetesService.getAllCronJobs(`${BUILDER_LABEL} = true, ${INSTANCE_LABEL} = ${this.kubernetesService.helmRelease}`);
    }
}
