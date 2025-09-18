import { CanActivate, Injectable, Logger } from "@nestjs/common";

import { KubernetesService } from "./kubernetes.service.js";

@Injectable()
export class PreventLocalInvocationGuard implements CanActivate {
    private readonly logger = new Logger(PreventLocalInvocationGuard.name);

    constructor(private readonly kubernetesService: KubernetesService) {}

    canActivate(): boolean {
        if (this.kubernetesService.localMode) {
            this.logger.warn("Local invocation not allowed, because the handler is related to build and/or Kubernetes");
            return false;
        }

        return true;
    }
}
