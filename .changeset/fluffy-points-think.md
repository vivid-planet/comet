---
"@comet/blocks-admin": minor
---

Add support for custom tab labels in OneOfBlock tabs

Usage:

-   Add tabLabels to `createOneOfBlock` props
    -   ````ts
        tabLabels: {
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
    -   the keys in the tabLabels need to be the same as the `supportedBlocks`
