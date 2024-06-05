import { V1CronJob } from "@kubernetes/client-node";
import { MikroORM, UseRequestContext } from "@mikro-orm/core";
import { Injectable, Logger } from "@nestjs/common";
import { Command, Console } from "nestjs-console";

import { KubernetesService } from "../kubernetes/kubernetes.service";
import { ContentScope } from "../user-permissions/interfaces/content-scope.interface";
import { BuildTemplatesService } from "./build-templates.service";
import { BuildsService } from "./builds.service";

@Injectable()
@Console()
export class ChangesCheckerConsole {
    private readonly logger = new Logger(ChangesCheckerConsole.name);

    constructor(
        private readonly orm: MikroORM, // MikroORM is injected so we can use the request context
        private readonly buildsService: BuildsService,
        private readonly buildTemplateService: BuildTemplatesService,
        private readonly kubernetesService: KubernetesService,
    ) {}

    @Command({
        command: "check-changes",
        description: "Checks if changes since last build happened and triggers a new build if so",
    })
    @UseRequestContext()
    async execute(): Promise<void> {
        this.logger.log("Checking if changes since last build occurred...");

        if (await this.buildsService.hasChangesSinceLastBuild()) {
            if (await this.buildsService.shouldRebuildAllScopes()) {
                this.logger.log("Starting build(s) for all scopes...");
                await this.buildsService.createBuildsForAllScopes("changesDetected");
            } else {
                const builderCronJobs = await this.buildTemplateService.getAllBuilderCronJobs();

                const getMatchingBuilderCronJob = (scope: ContentScope) => {
                    let matchingCronJob: V1CronJob | undefined;

                    for (const cronJob of builderCronJobs) {
                        const cronJobScope = this.kubernetesService.getContentScope(cronJob);

                        if (!cronJobScope) {
                            this.logger.warn(`CronJob ${cronJob.metadata?.name} has no scope, skipping...`);
                            continue;
                        }

                        // Exact match between job's scope and the scope with changes.
                        if (Object.entries(cronJobScope).every(([key, value]) => (scope as Record<string, unknown>)[key] === value)) {
                            matchingCronJob = cronJob;
                            break;
                        }

                        // Check if scopes match partially. For instance, a job's scope may be { "domain": "main" }, but the change was in
                        // { "domain": "main", "language": "en" }. Or the job's scope may be { "domain": "main", "language": "en" }, but the change
                        // was in { "domain": "main" }. In both cases, the job should still be started.
                        if (Object.entries(cronJobScope).some(([key, value]) => (scope as Record<string, unknown>)[key] === value)) {
                            matchingCronJob = cronJob;
                        }
                    }

                    if (!matchingCronJob) {
                        throw new Error(`Found changes in scope ${JSON.stringify(scope)} but no matching builder cron job!`);
                    }

                    return matchingCronJob;
                };

                const scopesWithChanges = await this.buildsService.getScopesWithChanges();
                const builderCronJobsToStart = scopesWithChanges.map((scope) => getMatchingBuilderCronJob(scope));

                this.logger.log(`Starting build(s) for scopes: ${JSON.stringify(scopesWithChanges)}...`);
                await this.buildsService.createBuilds("changesDetected", builderCronJobsToStart);
            }

            this.logger.log("Build(s) successfully started, resetting changesSinceLastBuild...");
            await this.buildsService.deleteChangesSinceLastBuild();
            this.logger.log("Resetting changesSinceLastBuild successful!");
        } else {
            this.logger.log("No changes detected, skipping build...");
        }
    }
}
