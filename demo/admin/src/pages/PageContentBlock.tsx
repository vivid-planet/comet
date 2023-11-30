import { createBlocksBlock, SpaceBlock, YouTubeVideoBlock } from "@comet/blocks-admin";
import { AnchorBlock, DamImageBlock, DamVideoBlock } from "@comet/cms-admin";
import { HeadlineBlock } from "@src/common/blocks/HeadlineBlock";
import { LinkListBlock } from "@src/common/blocks/LinkListBlock";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import { TextImageBlock } from "@src/common/blocks/TextImageBlock";
import { userGroupAdditionalItemFields } from "@src/userGroups/userGroupAdditionalItemFields";
import { UserGroupChip } from "@src/userGroups/UserGroupChip";
import { UserGroupContextMenuItem } from "@src/userGroups/UserGroupContextMenuItem";
import * as React from "react";

import { ColumnsBlock } from "./blocks/ColumnsBlock";
import { FullWidthImageBlock } from "./blocks/FullWidthImageBlock";
import { MediaBlock } from "./blocks/MediaBlock";
import { TwoListsBlock } from "./blocks/TwoListsBlock";
import { VideoBlock } from "./blocks/VideoBlock";

export const PageContentBlock = createBlocksBlock({
    name: "PageContent",
    supportedBlocks: {
        space: SpaceBlock,
        richtext: RichTextBlock,
        headline: HeadlineBlock,
        image: DamImageBlock,
        textImage: TextImageBlock,
        damVideo: DamVideoBlock,
        youTubeVideo: YouTubeVideoBlock,
        video: VideoBlock,
        linkList: LinkListBlock,
        fullWidthImage: FullWidthImageBlock,
        columns: ColumnsBlock,
        anchor: AnchorBlock,
        twoLists: TwoListsBlock,
        media: MediaBlock,
    },
    additionalItemFields: {
        ...userGroupAdditionalItemFields,
    },
    AdditionalItemContextMenuItems: ({ item, onChange, onMenuClose }) => {
        // TODO fix typing: infer additional fields somehow
        // @ts-expect-error missing additional field
        return <UserGroupContextMenuItem item={item} onChange={onChange} onMenuClose={onMenuClose} />;
    },
    AdditionalItemContent: ({ item }) => {
        // TODO fix typing: infer additional fields somehow
        // @ts-expect-error missing additional field
        return <UserGroupChip item={item} />;
    },
});
