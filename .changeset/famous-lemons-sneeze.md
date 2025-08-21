---
"@comet/cms-admin": minor
---

Add `tags` property to block factories to support adding translatable key words and improve searching for blocks in the `AddBlockDrawer`

Example usage:

```tsx
createCompositeBlock({
    name: "Media",
    displayName: "Media Block",
    blocks: {
        /* ... */
    },
    tags: [
        defineMessage({ id: "standaloneMedia.tag.image", defaultMessage: "Image" }),
        defineMessage({ id: "standaloneMedia.tag.video", defaultMessage: "Video" }),
    ],
    /* ... */
});
```
