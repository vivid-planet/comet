import { Stack, StackToolbar } from "@comet/admin";
import type { ReactNode } from "react";

import { ContentScopeIndicator } from "../../contentScope/ContentScopeIndicator";
import { EntityActionLogGrid, type EntityActionLogQueryName } from "./EntityActionLogGrid";

type EntityActionLogPageProps<TQuery> = {
    /**
     * Title shown in the Stack header (e.g. "News Action Log").
     */
    title: ReactNode;
    /**
     * Name of the top-level entity-scoped query field, e.g. `newsActionLogs`.
     *
     * Pass your app's `GQLQuery` as the generic to constrain this to a real action log query name.
     */
    queryName: EntityActionLogQueryName<TQuery>;
};

export function EntityActionLogPage<TQuery = Record<string, unknown>>({ title, queryName }: EntityActionLogPageProps<TQuery>) {
    return (
        <Stack topLevelTitle={title}>
            <StackToolbar scopeIndicator={<ContentScopeIndicator />} />
            <EntityActionLogGrid<TQuery> queryName={queryName} />
        </Stack>
    );
}
