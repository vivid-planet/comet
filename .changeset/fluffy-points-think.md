---
"@comet/blocks-admin": minor
---

Add support for custom labels in `createOneOfBlock`

**Example**

```tsx
const MediaBlock = createOneOfBlock({
    /* ... */
    labels: {
        // Use keys from supportedBlocks here
        image: (
            <Tooltip trigger="hover" title={<FormattedMessage id="pages.blocks.media.image" defaultMessage="Image" />}>
                <Image />
            </Tooltip>
        ),
        damVideo: (
            <Tooltip trigger="hover" title={<FormattedMessage id="pages.blocks.media.video.dam" defaultMessage="Video (DAM)" />}>
                <Video />
            </Tooltip>
        ),
        youTubeVideo: (
            <Tooltip trigger="hover" title={<FormattedMessage id="pages.blocks.media.video.youtube" defaultMessage="Video (YouTube)" />}>
                <YouTube />
            </Tooltip>
        ),
    },
});
```
