---
"@comet/admin": minor
"@comet/cms-admin": minor
"@comet/brevo-admin": minor
---

Add `DataGridProvider` context to inject a custom DataGrid component (e.g., `DataGridPro` or `DataGridPremium`) via `CometConfigProvider`. All internal DataGrid usages in `cms-admin` and `brevo-admin` now use the context-provided component, falling back to the base `DataGrid` from `@mui/x-data-grid`.
