"use client";
<<<<<<< HEAD
import { type PropsWithData, withPreview } from "@comet/cms-site";
import { type AnchorBlockData } from "@src/blocks.generated";
=======
import { PropsWithData, withPreview } from "@comet/site-nextjs";
import { AnchorBlockData } from "@src/blocks.generated";
>>>>>>> main

export const AnchorBlock = withPreview(
    ({ data: { name } }: PropsWithData<AnchorBlockData>) => {
        return name === undefined ? null : <div id={name} />;
    },
    { label: "Anchor" },
);
