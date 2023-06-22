import { ListBlock, PropsWithData, withPreview } from "@comet/cms-site";
import { DebugListBlockData } from "@src/blocks.generated";
import * as React from "react";

import DebugBlock from "./DebugBlock";

export const DebugListBlock = withPreview(
    ({ data }: PropsWithData<DebugListBlockData>) => {
        return <ListBlock data={data} block={(props) => <DebugBlock data={props} />} />;
    },
    { label: "Debug list" },
);
