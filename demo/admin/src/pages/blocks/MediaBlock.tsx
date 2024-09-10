import { Tooltip } from "@comet/admin";
import { Image, Video, YouTube } from "@comet/admin-icons";
import { BlockCategory, createOneOfBlock } from "@comet/blocks-admin";
import { DamImageBlock, DamVideoBlock, YouTubeVideoBlock } from "@comet/cms-admin";
import { FormattedMessage } from "react-intl";

export const MediaBlock = createOneOfBlock({
    name: "Media",
    displayName: <FormattedMessage id="pages.blocks.media" defaultMessage="Media" />,
    category: BlockCategory.Media,
    allowEmpty: false,
    variant: "toggle",
    supportedBlocks: { image: DamImageBlock, damVideo: DamVideoBlock, youTubeVideo: YouTubeVideoBlock },
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
    },
});
