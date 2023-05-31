import { OneOfBlock, PropsWithData, SupportedBlocks, withPreview } from "@comet/cms-site";
import { MediaBlockData } from "@src/blocks.generated";
import * as React from "react";

import { DamImageBlock } from "./DamImageBlock";
import DamVideoBlock from "./DamVideoBlock";

const supportedBlocks: SupportedBlocks = {
    image: (props) => <DamImageBlock data={props} />,
    video: (props) => <DamVideoBlock data={props} />,
};

export const MediaBlock = withPreview(
    ({ data }: PropsWithData<MediaBlockData>) => {
        return <OneOfBlock data={data} supportedBlocks={supportedBlocks} />;
    },
    { label: "Media" },
);
