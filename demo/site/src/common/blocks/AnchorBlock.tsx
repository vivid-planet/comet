"use client";
import { PropsWithData, withPreview } from "@comet/site-nextjs";
import { AnchorBlockData } from "@src/blocks.generated";

export const AnchorBlock = withPreview(
    ({ data: { name } }: PropsWithData<AnchorBlockData>) => {
        return name === undefined ? null : <div id={name} />;
    },
    { label: "Anchor" },
);
