import { MikroORM, UseRequestContext } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Command, Console } from "nestjs-console";

import { BuildsService } from "./builds.service";

@Injectable()
@Console()
export class ChangesCheckerConsole {
    constructor(
        private readonly orm: MikroORM, // MikroORM is injected so we can use the request context
        private readonly buildsService: BuildsService,
    ) {}

    @Command({
        command: "check-changes",
        description: "Checks if changes since last build happened and triggers a new build if so",
    })
    @UseRequestContext()
    async execute(): Promise<void> {
        console.log("Checking if changes since last build occurred...");

        if (await this.buildsService.hasChangesSinceLastBuild()) {
            console.log("Changes detected, starting build...");
            await this.buildsService.createBuildsForAllScopes("changesDetected");
            console.log("Build successfully started, resetting changesSinceLastBuild...");
            await this.buildsService.deleteChangesSinceLastBuild();
            console.log("Resetting changesSinceLastBuild successful!");
        } else {
            console.log("No changes detected, skipping build...");
        }
    }
}
