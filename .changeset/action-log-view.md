---
"@comet/cms-api": minor
"@comet/cms-admin": minor
---

Add Action Log view across entities

The action log was previously only accessible per entity from its detail page, which made deletions invisible after the fact (the detail page no longer exists). A cross-entity view answers the "who deleted this?" question.

**API**

A new top-level `actionLogs` query returns action log entries across all entities, with filters for `userId`, `entityName`, `entityId`, `action` (`Created` / `Updated` / `Deleted`) and `createdAt`, plus a required `scopes` argument. A new `actionLog(id: ID!)` query fetches a single entry by id. The `action` field is computed at query time (snapshot null → `Deleted`, version 1 → `Created`, otherwise → `Updated`). A new `previousVersion` resolveField on `ActionLog` returns the prior version of the same `(entityName, entityId)`, so the admin can render a diff against the prior snapshot.

Access is gated by the new `actionLog` permission. The scopes passed in are validated against the user's allowed content scopes for that permission and used to filter the results (rows whose `scope` jsonb array is contained in one of the allowed scopes, or whose `scope` is null). The per-entity action log on an entity detail page continues to use that entity's own permission.

**Admin**

A new `ActionLogsGrid` component (and a ready-to-use `ActionLogsPage`, titled "Action Log") render the cross-entity log with the columns Date / Time, Scope, Action, Entity type, Entity (snapshot-derived display name + id), User, plus per-row actions. The grid passes `useContentScope().values` as the `scopes` argument so users see only the action logs they're permitted to. Clicking a row (or the row's "Show version" action) opens a dialog with the diff vs. the previous version. The "Show action log for this entity" row action opens an `ActionLogsDialog` with the full per-entity history; it queries the global action_log table directly, so it works for deleted entities too. Add the page to the System area of your admin menu, requiring the `actionLog` permission.
