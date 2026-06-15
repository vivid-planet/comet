---
"@comet/cms-api": minor
"@comet/cms-admin": minor
---

Add per-entity Action Log queries and grid

The existing per-entity action log is exposed as a `ResolveField` on each entity (`news(id) { actionLogs }`) and therefore can't return rows for already-deleted entities — exactly the case where the action log matters most for non-admin users. Adding a top-level query that's gated by the entity's own permission keeps "who deleted this?" answerable without needing a global action log permission.

**API**

`ActionLogsModule.forFeature([Entity])` now generates an additional top-level `<entity>ActionLogs(scope, filter, sort, offset, limit, search): PaginatedActionLogs!` query for each registered entity (e.g. `newsActionLogs`, `productActionLogs`, `manufacturerActionLogs`). The query is automatically gated by the entity's own `@CrudGenerator({ requiredPermission })`, and always scopes results to the requested `scope` and the matching `entityName` server-side. The query works for deleted entities — unlike the existing nested `actionLogs` field resolver, which requires the parent entity to still exist. The existing nested `actionLog`/`actionLogs` field resolvers continue to work for the show-version / compare flows on detail pages.

**Admin**

A new `ActionLogGrid` renders the per-entity log with columns Date / Time, Action, Entity (display name + id), User. Clicking a row opens the version dialog directly from the row data so the flow also works for deleted entities. The grid takes a single typed `queryName` prop — passing your app's `GQLQuery` as the generic type-checks it against the available top-level action log queries, so misspellings or unknown entities are caught at compile time.

**Example — embedding inside the entity's existing `Stack`**

```tsx
import { Button, StackLink, StackPage, StackToolbar, ToolbarActions, ToolbarAutomaticTitleItem, ToolbarBackButton } from "@comet/admin";
import { Time } from "@comet/admin-icons";
import { ActionLogGrid } from "@comet/cms-admin";
import type { GQLQuery } from "@src/graphql.generated";

// inside <StackSwitch> of NewsPage:
<StackPage name="grid">
    <StackToolbar>
        <ToolbarActions>
            <Button startIcon={<Time />} component={StackLink} pageName="action-log" payload="action-log">
                Action Log
            </Button>
        </ToolbarActions>
    </StackToolbar>
    {/* …existing grid… */}
</StackPage>
<StackPage name="action-log" title="Action Log">
    <StackToolbar>
        <ToolbarBackButton />
        <ToolbarAutomaticTitleItem />
    </StackToolbar>
    <ActionLogGrid<GQLQuery> queryName="newsActionLogs" />
</StackPage>
```
