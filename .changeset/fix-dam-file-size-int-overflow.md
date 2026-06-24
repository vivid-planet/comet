---
"@comet/cms-api": patch
---

Fix DAM file listing failing for files larger than ~2 GB

The `size` field of `DamFile` and `FileUpload` was exposed as a GraphQL `Int`, which can only represent 32-bit signed integers (max ~2.1 GB). Files exceeding this size (e.g. large videos) caused the GraphQL response to fail with `Int cannot represent non 32-bit signed integer value`, breaking the DAM file list and the "Select files from DAM" dialog. The field is now exposed as `Float`, which safely represents the full range of file sizes stored in the database (`bigint`).
