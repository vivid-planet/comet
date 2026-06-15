---
"@comet/cms-api": minor
"@comet/cms-admin": minor
---

Add Global Action Log view

Adds a top-level `actionLogs` cross-entity Query plus an admin grid + page that uses it. Admins with the new `globalActionLog` permission can now inspect activity across all entities — including for deletions, where the entity's detail page no longer exists.

**API**

- New top-level Query `actionLogs(scopes, filter, sort, offset, limit, search): PaginatedActionLogs!` — read directly from the `action_log` table, scope-restricted server-side so users can only see action logs in scopes they have the `globalActionLog` permission for.
- Single-row Query `actionLog(id): ActionLog!` — used by the admin's show-version dialog.
- New `globalActionLog` core permission.
- New DTO `GlobalActionLogsArgs` (extends `ActionLogsArgs` with `scopes: ContentScope[]`).

**Admin**

- `GlobalActionLogGrid` — paginated grid with columns Date / Time, Scope, Action (chip), Entity type, Entity (display name + id), User.
- `GlobalActionLogPage` — top-level page using `GlobalActionLogGrid`.
- `GlobalActionLogShowVersionDialog` — opened on row click; renders `ActionLogCompare` for diffable rows (or `ActionLogShowVersion` for the first version of an entity).

**Example menu entry**

```tsx
{
    type: "route",
    primary: <FormattedMessage id="menu.actionLog" defaultMessage="Action Log" />,
    route: {
        path: "/system/action-log",
        component: GlobalActionLogPage,
    },
    requiredPermission: "globalActionLog",
}
```
