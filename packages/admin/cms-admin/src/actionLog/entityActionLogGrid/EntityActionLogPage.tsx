import { Stack, StackToolbar } from "@comet/admin";
import type { DocumentNode } from "graphql";
import { type ReactNode, useMemo } from "react";

import { ContentScopeIndicator } from "../../contentScope/ContentScopeIndicator";
import { createEntityActionLogsQuery, EntityActionLogGrid } from "./EntityActionLogGrid";

type EntityActionLogPageProps = {
    /**
     * Title shown in the Stack header (e.g. "News Action Log").
     */
    title: ReactNode;
    /**
     * Name of the top-level entity-scoped query field, e.g. `newsActionLogs`.
     */
    queryName: string;
    /**
     * Optional override for the GraphQL query document.
     * When omitted, a default query selecting the EntityActionLogGrid fragment is built from `queryName`.
     */
    actionLogsQuery?: DocumentNode;
};

export function EntityActionLogPage({ title, queryName, actionLogsQuery }: EntityActionLogPageProps) {
    const query = useMemo(() => actionLogsQuery ?? createEntityActionLogsQuery(queryName), [actionLogsQuery, queryName]);

    return (
        <Stack topLevelTitle={title}>
            <StackToolbar scopeIndicator={<ContentScopeIndicator />} />
            <EntityActionLogGrid actionLogsQuery={query} queryResultKey={queryName} persistentColumnStateKey={`EntityActionLogGrid-${queryName}`} />
        </Stack>
    );
}
