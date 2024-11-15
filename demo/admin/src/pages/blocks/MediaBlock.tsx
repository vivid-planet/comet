import { Tooltip } from "@comet/admin";
import { Image, Video, Vimeo, Youtube } from "@comet/admin-icons";
import { BlockCategory, createOneOfBlock } from "@comet/blocks-admin";
import { DamImageBlock, DamVideoBlock, VimeoVideoBlock, YouTubeVideoBlock } from "@comet/cms-admin";
import { FormattedMessage } from "react-intl";

export const MediaBlock = createOneOfBlock({
    name: "Media",
    displayName: <FormattedMessage id="pages.blocks.media" defaultMessage="Media" />,
    category: BlockCategory.Media,
    allowEmpty: false,
    variant: "toggle",
    supportedBlocks: { image: DamImageBlock, damVideo: DamVideoBlock, youTubeVideo: YouTubeVideoBlock, vimeoVideo: VimeoVideoBlock },
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
                <Youtube />
            </Tooltip>
        ),
        vimeoVideo: (
            <Tooltip trigger="hover" title={<FormattedMessage id="pages.blocks.media.video.vimeo" defaultMessage="Video (Vimeo)" />}>
                <Vimeo />
            </Tooltip>
        ),
    },
});
