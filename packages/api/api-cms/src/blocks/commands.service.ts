import { Injectable } from "@nestjs/common";
import { Command, Console } from "nestjs-console";

import { BlockIndexService } from "./block-index.service";
import { BlockMigrateService } from "./block-migrate.service";

@Injectable()
@Console()
export class CommandsService {
    constructor(private readonly blockIndexService: BlockIndexService, private readonly blockMigrateService: BlockMigrateService) {}

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
        await this.blockIndexService.createViews();
    }

    @Command({
        command: "refreshBlockIndexViews",
    })
    async refreshBlockIndexViews(): Promise<void> {
        await this.blockIndexService.refreshViews();
    }
}
