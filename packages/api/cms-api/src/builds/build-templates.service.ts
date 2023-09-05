import { V1CronJob } from "@kubernetes/client-node";
import { Inject, Injectable } from "@nestjs/common";

import { CurrentUserInterface } from "../auth/current-user/current-user";
import { INSTANCE_LABEL } from "../kubernetes/kubernetes.constants";
import { KubernetesService } from "../kubernetes/kubernetes.service";
import { AccessControlService } from "../user-permissions/access-control.service";
import { ACCESS_CONTROL_SERVICE } from "../user-permissions/user-permissions.const";
import { BUILDER_LABEL } from "./builds.constants";

@Injectable()
export class BuildTemplatesService {
    constructor(
        private readonly kubernetesService: KubernetesService,
        @Inject(ACCESS_CONTROL_SERVICE) private readonly accessControlService: AccessControlService,
    ) {}

    async getAllowedBuilderCronJobs(user: CurrentUserInterface): Promise<V1CronJob[]> {
        return (await this.getAllBuilderCronJobs()).filter((cronJob) => {
            return this.accessControlService.canAccessScope(this.kubernetesService.getContentScope(cronJob), user);
        });
    }

    async getAllBuilderCronJobs(): Promise<V1CronJob[]> {
        return this.kubernetesService.getAllCronJobs(`${BUILDER_LABEL} = true, ${INSTANCE_LABEL} = ${this.kubernetesService.helmRelease}`);
    }
}
