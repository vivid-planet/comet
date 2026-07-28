import { describe, expect, it } from "vitest";

import { type ExplainAnalyzeResult, summarizeBlockIndexDependenciesExplain } from "./block-index-dependencies-explain";

const explainWithDiskSortAndTwoEntityInfoScans: ExplainAnalyzeResult = {
    "Planning Time": 1.5,
    "Execution Time": 4200.75,
    Plan: {
        "Node Type": "Hash Left Join",
        "Shared Hit Blocks": 21000,
        "Shared Read Blocks": 340,
        "Temp Read Blocks": 2090,
        "Temp Written Blocks": 2090,
        Plans: [
            {
                "Node Type": "Sort",
                "Sort Space Type": "Disk",
                "Sort Space Used": 8192,
                "Sort Key": ["blockIndex.rootId"],
                Plans: [{ "Node Type": "Subquery Scan", Alias: "ei_root" }],
            },
            {
                "Node Type": "Subquery Scan",
                Alias: "ei_target",
            },
        ],
    },
};

describe("summarizeBlockIndexDependenciesExplain", () => {
    it("extracts run time, buffer usage, disk sorts and EntityInfo scan nodes", () => {
        const summary = summarizeBlockIndexDependenciesExplain(explainWithDiskSortAndTwoEntityInfoScans);

        expect(summary).toEqual({
            planningTimeMs: 1.5,
            executionTimeMs: 4200.75,
            sharedBlocksHit: 21000,
            sharedBlocksRead: 340,
            tempBlocksRead: 2090,
            tempBlocksWritten: 2090,
            diskSorts: [{ sortKey: ["blockIndex.rootId"], sortSpaceUsedKb: 8192 }],
            entityInfoScanNodes: 2,
        });
    });

    it("counts EntityInfo scans matched by relation name as well as alias", () => {
        const explain: ExplainAnalyzeResult = {
            Plan: {
                "Node Type": "Nested Loop",
                Plans: [
                    { "Node Type": "Seq Scan", "Relation Name": "EntityInfo" },
                    { "Node Type": "Subquery Scan", Alias: "ei_root" },
                ],
            },
        };

        expect(summarizeBlockIndexDependenciesExplain(explain).entityInfoScanNodes).toBe(2);
    });

    it("defaults missing counters to zero and reports no disk sorts for an in-memory sort", () => {
        const explain: ExplainAnalyzeResult = {
            Plan: {
                "Node Type": "Sort",
                "Sort Space Type": "Memory",
                "Sort Space Used": 64,
            },
        };

        const summary = summarizeBlockIndexDependenciesExplain(explain);

        expect(summary.diskSorts).toEqual([]);
        expect(summary.sharedBlocksHit).toBe(0);
        expect(summary.tempBlocksWritten).toBe(0);
        expect(summary.planningTimeMs).toBe(0);
        expect(summary.executionTimeMs).toBe(0);
        expect(summary.entityInfoScanNodes).toBe(0);
    });
});
