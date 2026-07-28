/**
 * Minimal shape of a node in PostgreSQL's `EXPLAIN (FORMAT JSON)` output. Only the fields the
 * diagnosis reads are typed; everything else is preserved via the index signature.
 */
export interface ExplainPlanNode {
    "Node Type": string;
    "Relation Name"?: string;
    Alias?: string;
    "Shared Hit Blocks"?: number;
    "Shared Read Blocks"?: number;
    "Temp Read Blocks"?: number;
    "Temp Written Blocks"?: number;
    "Sort Space Type"?: "Memory" | "Disk";
    "Sort Space Used"?: number;
    "Sort Key"?: string[];
    Plans?: ExplainPlanNode[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface ExplainAnalyzeResult {
    Plan: ExplainPlanNode;
    "Planning Time"?: number;
    "Execution Time"?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface DiskSort {
    sortKey: string[];
    sortSpaceUsedKb: number;
}

export interface BlockIndexDependenciesExplainSummary {
    planningTimeMs: number;
    executionTimeMs: number;
    sharedBlocksHit: number;
    sharedBlocksRead: number;
    tempBlocksRead: number;
    tempBlocksWritten: number;
    diskSorts: DiskSort[];
    /**
     * Number of plan nodes that scan the `EntityInfo` view (matched by the `ei_root` / `ei_target`
     * aliases or the relation name). This is a best-effort read of the runtime plan; the planner may
     * inline or merge the view. The authoritative, structural count is the number of `EntityInfo`
     * references in the generated SQL (see `entityInfoReferences` on the diagnosis result).
     */
    entityInfoScanNodes: number;
}

function flattenPlanNodes(node: ExplainPlanNode): ExplainPlanNode[] {
    const nodes: ExplainPlanNode[] = [node];
    for (const child of node.Plans ?? []) {
        nodes.push(...flattenPlanNodes(child));
    }
    return nodes;
}

function isEntityInfoScan(node: ExplainPlanNode): boolean {
    return node.Alias === "ei_root" || node.Alias === "ei_target" || node["Relation Name"] === "EntityInfo";
}

/**
 * Reduces a PostgreSQL `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)` result to the metrics that matter
 * for spotting a `block_index_dependencies` refresh regression: run time, buffer usage, on-disk
 * sorts and the number of `EntityInfo` scans.
 *
 * Buffer counters are read from the root node, where PostgreSQL reports them inclusive of all child
 * nodes.
 */
export function summarizeBlockIndexDependenciesExplain(explain: ExplainAnalyzeResult): BlockIndexDependenciesExplainSummary {
    const root = explain.Plan;
    const nodes = flattenPlanNodes(root);

    const diskSorts: DiskSort[] = nodes
        .filter((node) => node["Sort Space Type"] === "Disk")
        .map((node) => ({ sortKey: node["Sort Key"] ?? [], sortSpaceUsedKb: node["Sort Space Used"] ?? 0 }));

    return {
        planningTimeMs: explain["Planning Time"] ?? 0,
        executionTimeMs: explain["Execution Time"] ?? 0,
        sharedBlocksHit: root["Shared Hit Blocks"] ?? 0,
        sharedBlocksRead: root["Shared Read Blocks"] ?? 0,
        tempBlocksRead: root["Temp Read Blocks"] ?? 0,
        tempBlocksWritten: root["Temp Written Blocks"] ?? 0,
        diskSorts,
        entityInfoScanNodes: nodes.filter(isEntityInfoScan).length,
    };
}

export interface BlockIndexDependenciesExplainResult extends BlockIndexDependenciesExplainSummary {
    /**
     * Number of textual `"EntityInfo"` references in the generated view SQL. This is the structural
     * invariant that regressed in the 2026 incident (2 → 2 per root block): it must stay at 2
     * regardless of the number of root blocks.
     */
    entityInfoReferences: number;
    plan: ExplainAnalyzeResult;
}
