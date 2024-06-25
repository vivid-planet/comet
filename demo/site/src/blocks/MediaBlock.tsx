import { DamVideoBlock, OneOfBlock, PropsWithData, SupportedBlocks, withPreview } from "@comet/cms-site";
import { MediaBlockData } from "@src/blocks.generated";
import { CookieSafeYouTubeVideoBlock } from "@src/blocks/CookieSafeYouTubeVideoBlock";
import * as React from "react";

import { DamImageBlock } from "./DamImageBlock";

const supportedBlocks: SupportedBlocks = {
    image: (props) => <DamImageBlock data={props} />,
    video: (props) => <DamVideoBlock data={props} />,
    youTube: (props) => <CookieSafeYouTubeVideoBlock data={props} />,
};

export const MediaBlock = withPreview(
    ({ data }: PropsWithData<MediaBlockData>) => {
        return <OneOfBlock data={data} supportedBlocks={supportedBlocks} />;
    },
    { label: "Media" },
);
