---
"@dextinity/cms-admin": patch
---

Fix hover marking between a block list and the block preview

Hovering a block in the block list didn't mark it in the block preview, and hovering a block in the block preview neither marked its entry in the block list nor scrolled the list to it. This affected the entries of `BlocksBlock`, `ListBlock` and `ColumnsBlock` and the child blocks of composite blocks.
