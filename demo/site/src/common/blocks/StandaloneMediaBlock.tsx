import { PropsWithData, WithPreviewComponent } from "@comet/cms-site";
import { StandaloneMediaBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";

import { MediaBlock } from "./MediaBlock";

export const StandaloneMediaBlock = ({ data }: PropsWithData<StandaloneMediaBlockData>) => {
    const { media, aspectRatio } = data;
    return (
        <WithPreviewComponent data={data} label="Media">
            <PageLayout>
                <MediaBlock data={media} aspectRatio={aspectRatio} />
            </PageLayout>
        </WithPreviewComponent>
    );
};
