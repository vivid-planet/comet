---
"@comet/admin": patch
---

Fix Data Grid Excel export for `singleSelect` columns

When a `singleSelect` column uses `valueOptions`, Excel export now resolves the exported cell value to the matching option label unless a custom `valueFormatter` overrides it.
