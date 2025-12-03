import { Command, CommandRunner } from "nest-commander";

import { BlockMigrateService } from "./block-migrate.service";

@Command({
    name: "migrateBlocks",
    description: "Should be done after every deployment",
})
export class MigrateBlocksCommand extends CommandRunner {
    constructor(private readonly blockMigrateService: BlockMigrateService) {
        super();
    }

    async run(): Promise<void> {
        await this.blockMigrateService.migrateBlocks();
    }
}
