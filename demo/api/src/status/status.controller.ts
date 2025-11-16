import { DisableCometGuards } from "@comet/cms-api";
import { EntityManager } from "@mikro-orm/postgresql";
import { Controller, Get, Header } from "@nestjs/common";
import { HealthCheck, HealthCheckService } from "@nestjs/terminus";

import { CronJobsHealthIndicator } from "./cron-jobs.health-indicator";

@Controller("status")
@DisableCometGuards()
export class StatusController {
    constructor(
        private readonly entityManager: EntityManager,
        private healthCheckService: HealthCheckService,
        private cronJobsHealthIndicator: CronJobsHealthIndicator,
    ) {}

    @Get("liveness")
    @Header("cache-control", "no-store")
    liveness(): string {
        // If this controller returns a non 2xx status code, the pod is restarted by kubernetes
        // see https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/
        return "OK";
    }

    @Get("readiness")
    @Header("cache-control", "no-store")
    async readiness(): Promise<string> {
        // If this controller returns a non 2xx status code, the pod does not receive traffic
        // If the database is not available, it does not make sense to restart the pod
        // However, the pod should not receive traffic anymore as it can't handle it without the database
        // see https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-readiness-probes
        //
        // If your application is not relying on the database, you can remove the next line
        // If your application is relying on another service (e.g. redis), add a health-check here
        await this.entityManager.execute("SELECT 1+1"); // could possibly be refactored to MikroOrmHealthIndicator if we decide to go for Terminus
        return "OK";
    }

    @Get("cron-jobs")
    @HealthCheck() // prevents caching and adds request to swagger documentation if installed
    async cronJobs() {
        return this.healthCheckService.check([() => this.cronJobsHealthIndicator.isHealthy()]);
    }
}
