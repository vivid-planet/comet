export const DEPENDENCIES_CONFIG = "dependencies-config";

export interface DependenciesConfig {
    blockIndexRefresh?: {
        /**
         * Value for the PostgreSQL `work_mem` setting applied (transaction-locally) to the
         * `block_index_dependencies` refresh, e.g. `"64MB"`. Bounds the memory a pathological
         * refresh may use per plan node, so it spills to disk instead of OOM-killing the database
         * server. When unset, the server-level `work_mem` is inherited.
         */
        workMem?: string;
        /**
         * Value for the PostgreSQL `statement_timeout` setting (in milliseconds) applied
         * (transaction-locally) to the `block_index_dependencies` refresh. Aborts a refresh that
         * runs longer than this. Defaults to `0` (disabled), because a too-tight timeout turns a
         * slow-but-working refresh into a permanently failing one — enabling it is a deliberate
         * per-project deployment decision.
         */
        statementTimeout?: number;
    };
}
