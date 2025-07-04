import { V1CronJob } from "@kubernetes/client-node";
import { Inject, Injectable } from "@nestjs/common";

import { CometPermission } from "../common/enum/comet-permission.enum";
import { INSTANCE_LABEL } from "../kubernetes/kubernetes.constants";
import { KubernetesService } from "../kubernetes/kubernetes.service";
import { CurrentUser } from "../user-permissions/dto/current-user";
import { ACCESS_CONTROL_SERVICE } from "../user-permissions/user-permissions.constants";
import { AccessControlServiceInterface } from "../user-permissions/user-permissions.types";
import { BUILDER_LABEL } from "./builds.constants";

@Injectable()
export class BuildTemplatesService {
    constructor(
        private readonly kubernetesService: KubernetesService,
        @Inject(ACCESS_CONTROL_SERVICE) private accessControlService: AccessControlServiceInterface,
    ) {}

    async getAllowedBuilderCronJobs(user: CurrentUser): Promise<V1CronJob[]> {
        const builderCronJobs = await this.getAllBuilderCronJobs();
        return builderCronJobs.filter((cronJob) => {
            return this.accessControlService.isAllowed(user, CometPermission.builds, this.kubernetesService.getContentScope(cronJob) ?? {});
        });
    }

    async getAllBuilderCronJobs(): Promise<V1CronJob[]> {
        return this.kubernetesService.getAllCronJobs(`${BUILDER_LABEL} = true, ${INSTANCE_LABEL} = ${this.kubernetesService.helmRelease}`);
    }
}
