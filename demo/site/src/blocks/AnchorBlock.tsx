"use client";
import { PropsWithData, withPreview } from "@comet/cms-site";
import { AnchorBlockData } from "@src/blocks.generated";
import * as React from "react";

const AnchorBlock = withPreview(
    ({ data: { name } }: PropsWithData<AnchorBlockData>) => {
        if (name === undefined) {
            return null;
        }

        return <div id={name} />;
    },
    { label: "Anchor" },
);

export { AnchorBlock };
