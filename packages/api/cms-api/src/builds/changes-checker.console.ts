import { MikroORM, UseRequestContext } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Command, Console } from "nestjs-console";

import { KubernetesService } from "../kubernetes/kubernetes.service";
import { ContentScope } from "../user-permissions/interfaces/content-scope.interface";
import { BuildTemplatesService } from "./build-templates.service";
import { BuildsService } from "./builds.service";

@Injectable()
@Console()
export class ChangesCheckerConsole {
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
        console.log("Checking if changes since last build occurred...");

        if (await this.buildsService.hasChangesSinceLastBuild()) {
            if (await this.buildsService.shouldRebuildAllScopes()) {
                console.log("Starting build(s) for all scopes...");
                await this.buildsService.createBuildsForAllScopes("changesDetected");
            } else {
                const builderCronJobs = await this.buildTemplateService.getAllBuilderCronJobs();

                const getMatchingBuilderCronJob = (scope: ContentScope) => {
                    for (const cronJob of builderCronJobs) {
                        const cronJobScope = this.kubernetesService.getContentScope(cronJob);

                        // Check if scopes match partially. For instance, a job's scope may be { "domain": "main" }, but the change was in
                        // { "domain": "main", "language": "en" }. Or the job's scope may be { "domain": "main", "language": "en" }, but the change
                        // was in { "domain": "main" }. In both cases, the job should still be started.
                        if (Object.entries(cronJobScope).some(([key, value]) => (scope as Record<string, unknown>)[key] === value)) {
                            return cronJob;
                        }
                    }

                    throw new Error(`Found changes in scope ${JSON.stringify(scope)} but no matching builder cron job!`);
                };

                const scopesWithChanges = await this.buildsService.getScopesWithChanges();
                const builderCronJobsToStart = scopesWithChanges.map((scope) => getMatchingBuilderCronJob(scope));

                console.log(`Starting build(s) for scopes: ${JSON.stringify(scopesWithChanges)}...`);
                await this.buildsService.createBuilds("changesDetected", builderCronJobsToStart);
            }

            console.log("Build(s) successfully started, resetting changesSinceLastBuild...");
            await this.buildsService.deleteChangesSinceLastBuild();
            console.log("Resetting changesSinceLastBuild successful!");
        } else {
            console.log("No changes detected, skipping build...");
        }
    }
}
