---
"@comet/cms-api": patch
---

Improve error message in `Migration20240702123233`

`Migration20240702123233` adds a valid file extension to every DamFile#name that doesn't have an extension yet.
Previously, the migration crashed without a helpful error message if the mimetype of a file wasn't in [mime-db](https://www.npmjs.com/package/mime-db).
Now, the migration throws an error including the problematic mimetype.
