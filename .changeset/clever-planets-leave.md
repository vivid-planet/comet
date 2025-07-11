---
"@comet/blocks-admin": minor
---

Enable displaying icons in `BlockPreviewContent` by extending the `BlockInterface.previewContent` method to support objects of type `"icon"`

To display an icon, pass an object like `{ type: "icon", content: <Icon /> }` to the `previewContent` prop.
