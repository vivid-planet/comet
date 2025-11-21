import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";

import { CronJobsHealthIndicator } from "./cron-jobs.health-indicator";
import { StatusController } from "./status.controller";

@Module({ imports: [TerminusModule], providers: [CronJobsHealthIndicator], controllers: [StatusController] })
export class StatusModule {}
