"use client";
<<<<<<< HEAD
import { ListBlock, type PropsWithData } from "@comet/cms-site";
import { type StageBlockData } from "@src/blocks.generated";
=======
import { ListBlock, PropsWithData } from "@comet/site-nextjs";
import { StageBlockData } from "@src/blocks.generated";
>>>>>>> main

import { BasicStageBlock } from "./BasicStageBlock";

export const StageBlock = ({ data }: PropsWithData<StageBlockData>) => {
    return <ListBlock data={data} block={(block) => <BasicStageBlock data={block} />} />;
};
