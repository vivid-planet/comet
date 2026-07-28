import { CreateRequestContext, MikroORM } from "@mikro-orm/postgresql";
import { Command, CommandRunner, Option } from "nest-commander";

import { BlockIndexDependenciesExplainResult } from "../dependencies/block-index-dependencies-explain";
import { DependenciesService } from "../dependencies/dependencies.service";

function printExplainSummary(result: BlockIndexDependenciesExplainResult): void {
    console.log("block_index_dependencies refresh analysis");
    console.log("");
    console.log(`  Execution time:          ${result.executionTimeMs.toFixed(1)} ms`);
    console.log(`  Planning time:           ${result.planningTimeMs.toFixed(1)} ms`);
    console.log(`  Shared blocks (hit/read): ${result.sharedBlocksHit} / ${result.sharedBlocksRead}`);
    console.log(`  Temp blocks (read/written): ${result.tempBlocksRead} / ${result.tempBlocksWritten}`);
    console.log(`  EntityInfo references in SQL: ${result.entityInfoReferences}`);
    console.log(`  EntityInfo scan nodes in plan: ${result.entityInfoScanNodes}`);

    if (result.diskSorts.length > 0) {
        console.log(`  On-disk sorts: ${result.diskSorts.length}`);
        for (const diskSort of result.diskSorts) {
            const sortKey = diskSort.sortKey.length > 0 ? ` on ${diskSort.sortKey.join(", ")}` : "";
            console.log(`    - ${diskSort.sortSpaceUsedKb} kB${sortKey}`);
        }
    } else {
        console.log("  On-disk sorts: none");
    }
}

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
    async run(params: string[], options: { force?: true; explain?: true; json?: true }): Promise<void> {
        if (options.explain) {
            const result = await this.dependenciesService.explainBlockIndexDependenciesRefresh();

            if (result === null) {
                console.log("Nothing to analyze: no root block entities found");
                return;
            }

            if (options.json) {
                console.log(JSON.stringify(result, null, 2));
            } else {
                printExplainSummary(result);
            }
            return;
        }

        console.time("refreshing block index views");
        const result = await this.dependenciesService.refreshViews({ awaitRefresh: true, force: options.force });
        console.timeEnd("refreshing block index views");

        if (result === "skipped") {
            console.log("Skipped refresh: block index views are fresh enough");
        } else {
            console.log("Refreshed block index views");
        }
    }

    @Option({
        flags: "-f, --force",
        description: "Force a refresh (otherwise no update is made if the last refresh was less than 5 minutes ago)",
    })
    parseForce() {}

    @Option({
        flags: "--explain",
        description: "Analyze the block_index_dependencies refresh (EXPLAIN ANALYZE the defining query) instead of refreshing",
    })
    parseExplain() {}

    @Option({
        flags: "--json",
        description: "Output the analysis as JSON (only together with --explain)",
    })
    parseJson() {}
}
