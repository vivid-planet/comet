import { CreateRequestContext, MikroORM } from "@mikro-orm/postgresql";
import { Command, CommandRunner, Option } from "nest-commander";

import { DependenciesService } from "../dependencies/dependencies.service";

@Command({
    name: "refreshBlockIndexViews",
})
export class RefreshBlockIndexViewsCommand extends CommandRunner {
    constructor(
        private readonly dependenciesService: DependenciesService,
        // orm is necessary, otherwise @CreateRequestContext() doesn't work
        private readonly orm: MikroORM,
    ) {
        super();
    }

    @CreateRequestContext()
    async run(params: string[], options: { force?: true }): Promise<void> {
        await this.dependenciesService.refreshViews({ awaitRefresh: true, force: options.force });
    }

    @Option({
        flags: "-f, --force",
        description: "Force a refresh (otherwise no update is made if the last refresh was less than 5 minutes ago)",
    })
    parseForce() {}
}
