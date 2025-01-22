import { Tooltip } from "@comet/admin";
import { Image, Video, Vimeo, Youtube } from "@comet/admin-icons";
import { BlockCategory, BlockInterface, createOneOfBlock } from "@comet/blocks-admin";
import { DamImageBlock, DamVideoBlock, VimeoVideoBlock, YouTubeVideoBlock } from "@comet/cms-admin";
import { FormattedMessage } from "react-intl";

export const MediaBlock: BlockInterface = createOneOfBlock({
    supportedBlocks: { image: DamImageBlock, damVideo: DamVideoBlock, youTubeVideo: YouTubeVideoBlock, vimeoVideo: VimeoVideoBlock },
    name: "Media",
    displayName: <FormattedMessage id="mediaBlock.displayName" defaultMessage="Media" />,
    allowEmpty: false,
    variant: "toggle",
    labels: {
        image: (
            <Tooltip title={DamImageBlock.displayName}>
                <Image />
            </Tooltip>
        ),
        damVideo: (
            <Tooltip title={DamVideoBlock.displayName}>
                <Video />
            </Tooltip>
        ),
        youTubeVideo: (
            <Tooltip title={YouTubeVideoBlock.displayName}>
                <Youtube />
            </Tooltip>
        ),
        vimeoVideo: (
            <Tooltip title={VimeoVideoBlock.displayName}>
                <Vimeo />
            </Tooltip>
        ),
    },
    category: BlockCategory.Media,
});
