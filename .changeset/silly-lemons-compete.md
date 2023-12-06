---
"@comet/blocks-admin": patch
---

Infer additional item fields in `BlocksBlock` and `ListBlock`

Additional fields in the `item` prop of `AdditionalItemContextMenuItems` and `AdditionalItemContent` will be tyoed correctly if the `additionalItemFields` option is strongly typed.
