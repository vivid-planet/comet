"use client";
import { PropsWithData, withPreview } from "@comet/site-next";
import { StandaloneMediaBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";

import { MediaBlock } from "./MediaBlock";

export const StandaloneMediaBlock = withPreview(
    ({ data: { media, aspectRatio } }: PropsWithData<StandaloneMediaBlockData>) => {
        return (
            <PageLayout>
                <MediaBlock data={media} aspectRatio={aspectRatio} />
            </PageLayout>
        );
    },
    { label: "Media" },
);
