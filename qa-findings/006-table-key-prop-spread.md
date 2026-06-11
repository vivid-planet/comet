# `Table` component spreads a props object containing `key` into JSX (React error)

- **Severity:** minor
- **Location:** Admin → Project Snips → Main Menu — `http://localhost:8000/main/en/project-snips/main-menu` (any page using the legacy `Table` from `@comet/admin`)
- **Affected code:** `packages/admin/admin/src/table/Table.tsx:220-225`

## Summary

`Table` builds the row props object including `key` and the default renderer spreads it into JSX:

```ts
const renderTableRow = this.props.renderTableRow || ((props) => <DefaultTableRow {...props} />);
return renderTableRow({
    index,
    row,
    columns: this.props.columns,
    key: row.id,
    ...
```

React 18.3+/19 logs an error for this pattern:

```
A props object containing a "key" prop is being spread into JSX:
  let props = {key: someKey, index: ..., row: ..., columns: ..., rowProps: ...};
  <DefaultTableRow {...props} />
React keys must be passed directly to JSX without using spread
```

## Steps to reproduce

1. Log in to the Demo Admin.
2. Navigate to **Project Snips → Main Menu** (`/main/en/project-snips/main-menu`).
3. Open the browser console.

## Expected vs. actual behavior

- **Expected:** `key` is passed directly (`<DefaultTableRow key={row.id} {...props} />`); no console error.
- **Actual:** The error above is logged whenever a legacy `Table` renders rows.

## Evidence

- Screenshot: [screenshots/006-main-menu-table.png](screenshots/006-main-menu-table.png)
- Screencast: [screencasts/006-table-key-prop-spread.webm](screencasts/006-table-key-prop-spread.webm)
