---
"@comet/cms-admin": minor
---

Add per-entity drill-in dialog to Global Action Log view

Adds a row action on `GlobalActionLogGrid` (clock icon) that opens a new `GlobalActionLogDialog` showing the complete version history of the clicked entity. Inside that dialog, users get the familiar version grid → show single version → compare two versions workflow, reusing `ActionLogVersionGrid`, `ActionLogShowVersion`, and `ActionLogCompare`.

The dialog reads from the top-level `actionLogs(filter)` query — same gating (`globalActionLog` permission) as the grid — so it also works for entities that have been deleted.
