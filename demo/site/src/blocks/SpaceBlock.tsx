import { PropsWithData, withPreview } from "@comet/site-cms";
import { SpaceBlockData } from "@src/blocks.generated";
import * as React from "react";

const SpaceBlock: React.FunctionComponent<PropsWithData<SpaceBlockData>> = ({ data: { height } }) => {
    return <div style={{ height: `${height}px` }} />;
};

export default withPreview(SpaceBlock, { label: "Abstand" });
