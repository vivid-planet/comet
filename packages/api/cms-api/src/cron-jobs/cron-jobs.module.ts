import { Module } from "@nestjs/common";

import { CronJobsResolver } from "./cron-jobs.resolver";

@Module({ providers: [CronJobsResolver] })
export class CronJobsModule {}
