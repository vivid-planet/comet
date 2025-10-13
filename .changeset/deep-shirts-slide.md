---
"@comet/cms-admin": patch
---

Remove "Usages" column from DAM

The `dependents` field resolver triggers multiple refreshes of the `block_index_dependencies` view, which seems to crash the API.
