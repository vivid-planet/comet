import { PropsWithData, withPreview } from "@comet/cms-site";
import { DemoSpaceBlockData } from "@src/blocks.generated";
import * as React from "react";

const SpaceMapping: Record<string, number> = {
    d150: 10,
    d200: 20,
    d250: 40,
    d300: 60,
    d350: 80,
    d400: 100,
    d450: 150,
    d500: 200,
    d550: 250,
    d600: 300,
};

const SpaceBlock: React.FC<PropsWithData<DemoSpaceBlockData>> = ({ data: { spacing } }) => {
    return <div style={{ height: `${SpaceMapping[spacing]}px` }} />;
};

export default withPreview(SpaceBlock, { label: "Abstand" });
