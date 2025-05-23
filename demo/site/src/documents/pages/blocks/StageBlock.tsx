"use client";
import { ListBlock, PropsWithData } from "@comet/site-nextjs";
import { StageBlockData } from "@src/blocks.generated";

import { BasicStageBlock } from "./BasicStageBlock";

export const StageBlock = ({ data }: PropsWithData<StageBlockData>) => {
    return <ListBlock data={data} block={(block) => <BasicStageBlock data={block} />} />;
};
