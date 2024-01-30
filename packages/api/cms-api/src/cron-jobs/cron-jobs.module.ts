import { Module } from "@nestjs/common";

import { CronJobsResolver } from "./cron-jobs.resolver";
import { CronJobsService } from "./cron-jobs.service";
import { JobsResolver } from "./jobs.resolver";
import { JobsService } from "./jobs.service";

@Module({ providers: [CronJobsResolver, JobsResolver, CronJobsService, JobsService] })
export class CronJobsModule {}
