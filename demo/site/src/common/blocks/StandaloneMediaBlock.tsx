"use client";
<<<<<<< HEAD
import { type PropsWithData, withPreview } from "@comet/cms-site";
import { type StandaloneMediaBlockData } from "@src/blocks.generated";
=======
import { PropsWithData, withPreview } from "@comet/site-nextjs";
import { StandaloneMediaBlockData } from "@src/blocks.generated";
>>>>>>> main
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
