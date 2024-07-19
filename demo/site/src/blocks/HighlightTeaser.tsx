import { PropsWithData, withPreview } from "@comet/cms-site";
import { HighlightTeaserBlockData } from "@src/blocks.generated";
import { DamImageBlock } from "@src/blocks/DamImageBlock";
import * as React from "react";

import RichTextBlock from "./RichTextBlock";

export const HighlightTeaserBlock = withPreview(
    ({ data: { title, description, image } }: PropsWithData<HighlightTeaserBlockData>) => {
        return (
            <>
                <p>{title}</p>
                <RichTextBlock data={description} />
                <DamImageBlock data={image} />
            </>
        );
    },
    { label: "HighlightTeaser" },
);
