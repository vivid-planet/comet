---
"@comet/admin-generator": patch
---

Revert "Replace ts-node with jiti"

This broke import aliases (e.g, `@src/`) in config files.
