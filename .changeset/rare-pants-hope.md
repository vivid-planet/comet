---
"@comet/blocks-api": minor
---

Deprecate `nullable: true` for child blocks

Nullable child blocks are not correctly supported in the Admin, for instance, in `createCompositeBlock`.
Save a block's default values instead.
