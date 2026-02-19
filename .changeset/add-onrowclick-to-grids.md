---
"@comet/admin-generator": minor
---

Grid: Add automatic `onRowClick` navigation

Generated grids now automatically navigate to the edit page when a row is clicked, improving user experience.

- When `rowActionProp` is `false` (default): generates a `handleRowClick` handler using `useStackSwitchApi().activatePage("edit", id)`
- When `rowActionProp` is `true`: adds an `onRowClick` prop to allow parent components to implement needed action
