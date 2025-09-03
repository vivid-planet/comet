---
"@comet/cms-admin": minor
---

Add `tags` property to block factories to support adding translatable key words and improve searching for blocks in the `AddBlockDrawer`

Tags of child blocks can be overwritten by passing tags to their parent.

Example usage:

```tsx
const MediaGalleryBlock = createCompositeBlock({
    name: "MediaGallery",
    displayName: "Media Gallery",
    blocks: {
        /* ... */
    },
    tags: [defineMessage({ id: "mediaGallery.tag.slider", defaultMessage: "Slider" })],
    /* ... */
});
```
