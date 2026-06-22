---
"@comet/cms-api": minor
"@comet/cms-admin": minor
---

Add restore-to-snapshot functionality for action logs

Entities decorated with `@ActionLogs()` now expose a `restore<EntityName>(id, actionLogId)` mutation that resets the entity to the state stored in the selected action log's snapshot. If the entity was deleted in the meantime, it is re-created from the snapshot. The restore itself is recorded as a new action log, so it can be undone.

In the admin, the `ActionLogDialog` (and `ActionLogButton`) now show a "Restore this version" button when viewing a version that has a snapshot. The restore requires the same permission as managing the entity.
