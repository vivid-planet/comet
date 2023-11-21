---
"@comet/cms-api": patch
---

`searchToMikroOrmQuery()` now ignores leading and trailing spaces. This fixes a bug where all rows were matched if there was a space before or after the search string.
