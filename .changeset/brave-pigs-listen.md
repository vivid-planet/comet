---
"@comet/cms-api": patch
---

Prevent a refresh of `block_index_dependencies` within 5 minutes of the last refresh

This was already the desired behavior, but the previous implementation was not working correctly.
