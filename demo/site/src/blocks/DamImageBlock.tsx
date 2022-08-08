import { OneOfBlock, PixelImageBlock, PropsWithData, SupportedBlocks, SvgImageBlock, withPreview } from "@comet/cms-site";
import { DamImageBlockData } from "@src/blocks.generated";
import * as React from "react";

const supportedBlocks: SupportedBlocks = {
    pixelImage: (props) => <PixelImageBlock data={props} layout="intrinsic" />,
    svgImage: (props) => <SvgImageBlock data={props} />,
};

export const DamImageBlock = withPreview(
    ({ data }: PropsWithData<DamImageBlockData>) => {
        return <OneOfBlock data={data} supportedBlocks={supportedBlocks} />;
    },
    { label: "Image" },
);
