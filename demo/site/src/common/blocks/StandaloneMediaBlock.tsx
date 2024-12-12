"use client";
import { PropsWithData, withPreview } from "@comet/cms-site";
import { StandaloneMediaBlockData } from "@src/blocks.generated";
import { MediaBlock } from "@src/common/blocks/MediaBlock";
import { PageLayout } from "@src/layout/PageLayout";

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
