---
"@comet/blocks-admin": minor
---

Add support for custom labels in OneOfBlock tabs

Usage:

-   Add labels to `createOneOfBlock` props
    -   ````ts
        labels: {
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
            }
            ```
        ````
    -   the keys in the labels need to be the same as the `supportedBlocks`
