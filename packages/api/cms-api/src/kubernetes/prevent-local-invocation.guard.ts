import { CanActivate, Injectable, Logger } from "@nestjs/common";

import { KubernetesService } from "./kubernetes.service";

@Injectable()
export class PreventLocalInvocationGuard implements CanActivate {
    private readonly logger = new Logger(PreventLocalInvocationGuard.name);

    constructor(private readonly kubernetesService: KubernetesService) {}

    canActivate(): boolean {
        if (this.kubernetesService.localMode) {
            this.logger.warn("Local invocaion not allowed, because the handler is related to build and/or Kubernetes");
            return false;
        }

        return true;
    }
}
