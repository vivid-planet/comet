---
"@comet/cms-api": patch
---

Consider filtered mimetypes when calculating the position of a DAM item in `DamItemsService`'s `getDamItemPosition()`

Previously, the mimetypes were ignored, sometimes resulting in an incorrect position.