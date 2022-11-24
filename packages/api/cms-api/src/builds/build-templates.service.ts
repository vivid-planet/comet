import { V1CronJob } from "@kubernetes/client-node";
import { Inject, Injectable } from "@nestjs/common";

import { CurrentUser } from "../auth/dto/current-user";
import { ContentScopeService } from "../content-scope/content-scope.service";
import { BUILDER_LABEL, BUILDS_CONFIG, INSTANCE_LABEL } from "./builds.constants";
import { BuildsConfig } from "./builds.module";
import { KubernetesService } from "./kubernetes.service";

@Injectable()
export class BuildTemplatesService {
    constructor(
        @Inject(BUILDS_CONFIG) readonly config: BuildsConfig,
        private readonly kubernetesService: KubernetesService,
        private readonly contentScopeService: ContentScopeService,
    ) {}

    async getAllowedBuilderCronJobs(user: CurrentUser): Promise<V1CronJob[]> {
        const allCronJobs = await this.kubernetesService.getAllCronJobs(
            `${BUILDER_LABEL} = true, ${INSTANCE_LABEL} = ${this.kubernetesService.helmRelease}`,
        );

        return allCronJobs.filter((cronJob) => {
            return this.contentScopeService.canAccessScope(this.kubernetesService.getContentScope(cronJob), user);
        });
    }
}
