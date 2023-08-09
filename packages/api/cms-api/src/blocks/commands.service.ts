import { MikroORM, UseRequestContext } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Command, Console } from "nestjs-console";

import { DependenciesService } from "../dependencies/dependencies.service";
import { BlockMigrateService } from "./block-migrate.service";

@Injectable()
@Console()
export class CommandsService {
    constructor(
        private readonly dependenciesService: DependenciesService,
        private readonly blockMigrateService: BlockMigrateService,
        private readonly orm: MikroORM,
    ) {}

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
        options: [
            {
                flags: "-f, --force [boolean]",
                defaultValue: false,
                description: "Force a refresh (otherwise no update is made if the last refresh was less than 5 minutes ago)",
            },
        ],
    })
    @UseRequestContext()
    async refreshBlockIndexViews(args: { force: boolean }): Promise<void> {
        await this.dependenciesService.refreshViews({ consoleCommand: true, force: args.force });
    }
}
