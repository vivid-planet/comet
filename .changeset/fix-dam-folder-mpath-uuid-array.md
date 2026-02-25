---
"@comet/cms-api": patch
---

Fix spurious MikroORM migration for `DamFolder.mpath`: change `columnType` from `"uuid array"` to `"uuid[]"` to match PostgreSQL's canonical array type notation, preventing a redundant `alter column ... type uuid array` from being generated on every `migration:create`.
