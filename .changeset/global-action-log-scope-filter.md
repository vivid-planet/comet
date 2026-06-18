---
"@comet/cms-api": minor
"@comet/cms-admin": minor
---

Add scope filter and sort to Global Action Log view

Extends the Global Action Log view introduced in the previous PR with the ability to filter and sort by content scope. The scope column gets an autocomplete-style filter that lists every scope the user has access to plus a "Global" entry for unscoped rows.

**API**

- New `ActionLogScopeFilter` input on `ActionLogFilter` with operators `equal` / `notEqual` / `isAnyOf` / `isGlobal`. The resolver translates these into PostgreSQL `jsonb` containment predicates so the filter is applied at the database layer.
- `scope` is added to `ActionLogSortField`.

**Admin**

- The Scope column on `GlobalActionLogGrid` gets a typeahead filter using MUI Autocomplete (`is` / `not` for single-value, `isAnyOf` for multi-select). Built on top of the data-grid's `baseTextField` slot so it inherits the panel theme.
- The Scope column becomes sortable.
