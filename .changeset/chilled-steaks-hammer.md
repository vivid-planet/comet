---
"@comet/cms-admin": patch
---

Prevent false positive save conflicts while editing documents (e.g. `Page`):

- Stop checking for conflicts while saving is in progress
- Ensure that all "CheckForChanges" polls are cleared
