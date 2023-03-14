import { Injectable } from "@nestjs/common";
import { Command, Console } from "nestjs-console";

import { DependenciesService } from "../dependencies/dependencies.service";
import { BlockMigrateService } from "./block-migrate.service";

@Injectable()
@Console()
export class CommandsService {
    constructor(private readonly dependenciesService: DependenciesService, private readonly blockMigrateService: BlockMigrateService) {}

    @Command({
        command: "migrateBlocks",
        description: "Should be done after every deployment",
    })
    async migrateBlocks(): Promise<void> {
        await this.blockMigrateService.migrateBlocks();
    }

    @Command({
        command: "createBlockIndexViews",
        description: "Should be done after every deployment",
    })
    async createViews(): Promise<void> {
        await this.dependenciesService.createViews();
    }

    @Command({
        command: "refreshBlockIndexViews",
    })
    async refreshBlockIndexViews(): Promise<void> {
        await this.dependenciesService.refreshViews();
    }
}
