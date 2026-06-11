# Warnings page: initial "open" filter uses non-existent field `state` → GraphQL 400, filter silently discarded

- **Severity:** major
- **Location:** Admin → System → Warnings — `http://localhost:8000/main/en/system/warnings`
- **Affected code:** `packages/admin/cms-admin/src/warnings/WarningsGrid.tsx:82`

## Summary

`WarningsGrid` initializes the data grid with `initialFilter: { items: [{ field: "state", operator: "is", value: "open" }] }`, but neither the grid columns nor the GraphQL `WarningFilter` input type have a field called `state` — the actual field is `status` (see `packages/api/cms-api/src/warnings/entities/warning.entity.ts`, property `status: WarningStatus`).

The first grid query is sent with `filter: { and: [{ state: { equal: "open" } }] }` and is rejected by the API with **HTTP 400**. The grid then renders **unfiltered** data, so the intended default view ("only open warnings") is silently lost — resolved/ignored warnings would be shown as well. Opening the filter panel shows an empty/dangling filter row instead of the intended `status = open` filter.

A secondary React error (`Cannot update a component (WarningsGrid) while rendering a different component (DataGridProRaw)`) is logged on the same page load.

## Steps to reproduce

1. Log in to the Demo Admin as "Admin".
2. Navigate to **System → Warnings** (`/main/en/system/warnings`).
3. Open the browser dev tools (Network/Console) and observe the first `POST /api/graphql` request.
4. Click the **Filter** button in the grid toolbar.

## Expected vs. actual behavior

- **Expected:** The grid loads with a working default filter `status = open`; the filter panel shows that filter; no failed requests.
- **Actual:** The first GraphQL request fails with 400 (`Field "state" is not defined by type "WarningFilter". Did you mean "status", "scope", or "type"?`). The grid falls back to showing **all** warnings, and the filter panel contains an empty filter row (field defaulting to "Date / Time").

## Console / network output

```
[http 400] POST http://localhost:8000/api/graphql
{"errors":[{"message":"Variable \"$filter\" got invalid value { state: { equal: \"open\" } } at \"filter.and[0]\";
Field \"state\" is not defined by type \"WarningFilter\". Did you mean \"status\", \"scope\", or \"type\"?", ...
"extensions":{"code":"BAD_USER_INPUT"...

[console.error] Cannot update a component (`WarningsGrid`) while rendering a different component (`DataGridProRaw`).
```

## Evidence

- Screenshot (grid after load): [screenshots/001-warnings-grid.png](screenshots/001-warnings-grid.png)
- Screenshot (filter panel without the intended filter): [screenshots/001-warnings-grid-filterpanel.png](screenshots/001-warnings-grid-filterpanel.png)
- Screencast: [screencasts/001-warnings-grid-invalid-initial-filter.webm](screencasts/001-warnings-grid-invalid-initial-filter.webm)
