---
"@comet/cms-api": patch
---

Fix `DamFolder.mpath` column type

Change the column type from `"uuid array"` to `"uuid[]"` to match PostgreSQL's canonical array type notation, preventing a redundant `alter column ... type uuid array` statement from being generated for every new migration.
