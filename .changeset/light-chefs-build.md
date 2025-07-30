---
"@comet/cms-admin": major
---

Remove `Grid` layout responsibility from `DashboardWidgetRoot`.

The component `DashboardWidgetRoot` no longer wraps its content inside a `<Grid>` component. This change delegates layout responsibility (e.g., grid column sizing) to the parent component.

**Before:**
`DashboardWidgetRoot` was always wrapped in `<Grid size={{ xs: 12, lg: 6 }}>`.

**After:**
No layout assumptions — parent components must now position the widget explicitly.

This change may require updates where `DashboardWidgetRoot` is used inside grid layouts.
