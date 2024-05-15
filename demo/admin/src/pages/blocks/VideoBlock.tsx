import { BlockCategory, createOneOfBlock, VimeoVideoBlock, YouTubeVideoBlock } from "@comet/blocks-admin";
import { DamVideoBlock } from "@comet/cms-admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

export const VideoBlock = createOneOfBlock({
    name: "Video",
    displayName: <FormattedMessage id="pages.blocks.video" defaultMessage="Video" />,
    category: BlockCategory.Media,
    supportedBlocks: { youtubeVideo: YouTubeVideoBlock, damVideo: DamVideoBlock, vimeoVideo: VimeoVideoBlock },
    allowEmpty: true,
});
